"""Ajudante comum dos testes de navegador: abre o Chromium do mesmo jeito em todos os t_*.py.
Uso: from navegador import abrir, B   ...   b = abrir(p)"""
import os
B = 'http://localhost:8123/'   # servidor estático que o run2.sh sobe


def abrir(p):
    """Abre o Chromium (usa CHROME_PATH se existir; senão, o do Playwright)."""
    return p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None, args=['--no-sandbox'])
