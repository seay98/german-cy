# German Verb Trainer

A simple browser-based trainer for practicing irregular German verbs. Built with plain HTML, CSS, and JavaScript, with a German-language interface.

## Getting Started

Keep [index.html](index.html) and [config.js](config.js) in the same directory, then open `index.html` in your browser. The entry page contains the current V6 trainer. No installation, build step, or server is required.

For GitHub Pages, publish both files in the root of the Pages source. The project URL is [seay98.github.io/german-cy](https://seay98.github.io/german-cy/).

## Features

- Practice infinitives, past tense forms, past participles, and auxiliary verbs.
- Optionally include irregular present tense forms.
- Filter verbs by group and get instant feedback.
- Practice textbook groups from pages 320–328 and meaning-dependent strong/weak variants from pages 330–332, with meaning hints.
- Review mistakes and track your progress using browser local storage.
- Earn a daily stamp by completing the configured number of exercises with all answers correct (currently 30).
- Track your seven-day stamp card, current and best streaks, and achievement badges.
- Export and import statistics, the mistake list, daily counts, and stamps as a JSON backup.

## Files

- `index.html`: Current V6 trainer, including verb data, exercises, progress tracking, and backup controls.
- `config.js`: Daily goal, streak achievement milestones, and default present-tense setting.
- `v1.html`: Original version covering textbook pages 320–323.
- `v2.html`: Expanded version covering textbook pages 320–328.
- `v3.html`: Earlier version adding daily goals, stamps, streaks, and achievements.

`DAILY_GOAL` must be a positive safe integer. `ACHIEVEMENT_DAYS` must be a nonempty array of positive safe integers; milestones refer to consecutive stamped days. `ASK_PRESENT_BY_DEFAULT` enables present-tense questions when set to `true`. Missing or invalid goal and milestone settings fall back to 50 exercises and `[1, 3, 7, 14, 30]` respectively.

Changing the goal updates the current target and the threshold for subsequent correct answers. Existing stamps remain awarded; historical stamps are not recalculated.

## Usage

Choose a verb group, fill in the missing forms, and click **Überprüfen** to check your answers. Use **Lösung zeigen** to reveal the answers or **Nächstes Verb** to continue. Press Enter to check an answer and again to move to the next verb.

Only fully correct exercises count toward the daily goal; incorrect exercises and revealed answers do not count. Use **Nur Fehler wiederholen** to practice the mistake list. Answers ignore letter case; when both auxiliary verbs are allowed, either is accepted. Meaning hints identify the required variant for verbs with meaning-dependent forms.

## Progress and backups

Progress is stored locally in the current browser and tied to the website address. Clearing browser storage removes saved progress; another browser, device, or address does not automatically share it.

Under **Lernfortschritt sichern & laden**, choose **Fortschritt sichern** to download a JSON backup. Choose **Fortschritt laden** to restore it, then confirm replacement of the current progress. Imports replace rather than merge data. Export a backup before updating the site or moving to another device or address.

**Fehlerliste und Statistik löschen** clears exercise statistics and the mistake list after confirmation; it leaves daily counts and stamps intact.
