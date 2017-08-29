# Web Dashboard fashion&fitness
Web Dashboard per la gestione dei contenuti dell'applicazione fashion&fitness.
<br>L'applicazione è composta da una parte grafica sviluppata con Bootstrap per la visualizzazione e il caricamento dei dati, quali i corsi che sono tenuti e il personale certificato che compone la palestra.

## Accesso
L'utilizzo della dashboard è protetto tramite credenziali d'accesso, salvate e gestite tramite Lovefield, un database relazionale sviluppato appositamente per applicazioni web. Di default lo username e la password sono entrambe "admin", ma è caldamente consigliato cambiarli per una sicurezza maggiore.

## Gestione dei dati
La gestione dei dati è resa possibile grazie a delle chiamate Ajax asincrone, che vanno a modificare i file corsi.json, team.json e promo.json caricati sul server.
