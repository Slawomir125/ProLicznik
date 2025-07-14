ProLicznik

ProLicznik to lekka i szybka aplikacja webowa napisana w React, która pozwala tworzyć wiele liczników z własnymi nazwami i kolorami. Projekt stworzony przez ucznia technikum z myślą o prostocie, nowoczesnym wyglądzie i eksperymentowaniu z dynamicznym interfejsem.

    Działająca aplikacja: https://slawomir125.github.io/ProLicznik/

Co potrafi ProLicznik?

    Dodawanie liczników z własnym kolorem i nazwą

    Liczenie kliknięć dla każdego licznika osobno

    Obliczanie sumy kliknięć ze wszystkich liczników

    Pokazywanie średniej liczby kliknięć na godzinę ("norma")

    Automatyczne rozmieszczanie liczników na ekranie (dynamiczne drzewo)

    Zapamiętywanie stanu w ciasteczkach przez 24h

Jak to działa?

    Gdy klikniesz w licznik, jego wartość się zwększa

    Przy pierwszym kliknięciu zapamiętuje się czas, by obliczać normę

    Aplikacja zapisuje wszystkie dane w ciasteczkach, więc po odświeżeniu nic nie znika

    Jeśli są przynajmniej dwa liczniki, pokazywana jest średnia norma /h

Technologie

    React (z hookami: useState, useEffect, useMemo)

    JS-Cookie – do ciasteczek

    Flexbox – dynamiczny układ liczników