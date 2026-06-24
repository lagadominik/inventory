import requests
from django.dispatch import receiver
from allauth.socialaccount.signals import social_account_updated, pre_social_login
from allauth.socialaccount.models import SocialLogin
import environ
import os

env = environ.Env()

GUILD_ID = os.environ.get('DISCORD_GUILD_ID', '')


def get_guild_member(access_token: str, guild_id: str) -> dict | None:
    """
    Pyta Discord API czy użytkownik jest na serwerze i pobiera jego dane.
    Zwraca dane członka lub None jeśli nie jest na serwerze.
    """
    response = requests.get(
        f'https://discord.com/api/users/@me/guilds/{guild_id}/member',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 200:
        return response.json()
    return None


@receiver(pre_social_login)
def on_pre_social_login(sender, request, sociallogin: SocialLogin, **kwargs):
    """
    Odpala się tuż przed zalogowaniem przez Discord.
    Sprawdzamy członkostwo i pobieramy nick z serwera.
    """
    if sociallogin.account.provider != 'discord':
        return

    # Pobierz token dostępu do Discord API
    token = sociallogin.token.token
    if not token or not GUILD_ID:
        return

    # Sprawdź czy użytkownik jest na serwerze
    member_data = get_guild_member(token, GUILD_ID)

    if member_data is None:
        # Użytkownik nie jest na serwerze — zablokuj logowanie
        from allauth.exceptions import ImmediateHttpResponse
        from django.http import HttpResponse
        raise ImmediateHttpResponse(
            HttpResponse(
                'Nie jesteś członkiem serwera Discord koła naukowego. '
                'Skontaktuj się z administratorem.',
                status=403
            )
        )

    # Pobierz nick z serwera (lub nazwę konta jeśli brak nicku)
    nick = member_data.get('nick') or sociallogin.account.extra_data.get('username', '')

    # Zapisz nick i discord_id w danych które allauth użyje do stworzenia/aktualizacji usera
    sociallogin.account.extra_data['server_nick'] = nick

    # Jeśli user już istnieje — zaktualizuj jego nick od razu
    if sociallogin.user.pk:
        from users.models import User
        try:
            user = User.objects.get(pk=sociallogin.user.pk)
            user.username = nick
            user.discord_id = str(sociallogin.account.extra_data.get('id', ''))
            user.avatar_url = _get_avatar_url(sociallogin.account.extra_data)
            user.save(update_fields=['username', 'discord_id', 'avatar_url'])
        except User.DoesNotExist:
            pass


def _get_avatar_url(extra_data: dict) -> str | None:
    """Buduje URL avatara Discord."""
    user_id = extra_data.get('id')
    avatar = extra_data.get('avatar')
    if user_id and avatar:
        return f'https://cdn.discordapp.com/avatars/{user_id}/{avatar}.png'
    return None