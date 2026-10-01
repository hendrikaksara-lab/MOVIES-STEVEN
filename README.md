# My Movie Shelf

A React movie collection manager backed by MockAPI. Movies are loaded from and saved to the API; the browser does not use local storage or a bundled in-app movie list.

## MockAPI setup

1. Create a project at [MockAPI](https://mockapi.io/) and add a resource named `movies`.
2. Create these fields in addition to MockAPI's generated `id`:

   | Field | Type |
   | --- | --- |
   | `title` | String |
   | `director` | String |
   | `genre` | String |
   | `release_year` | Number |
   | `rating` | Number |
   | `description` | String |
   | `image` | String |

3. Copy `.env.example` to `.env` and replace the example with your resource URL, for example `https://PROJECT_ID.mockapi.io/api/v1/movies`.
4. Add the eight sample records to MockAPI with `npm run seed`. Existing titles are skipped if you run the command again.
5. Start the app with `npm run dev`.

Restart the Vite dev server after changing `.env`. Keep your personal `.env` file private; only share the MockAPI resource URL when submitting the project.

## Features

- Browse movie posters and collection details.
- Search by title or director; filter by genre and minimum rating.
- Add movies with required-field, year, rating, and image URL validation plus a poster preview.
- View details, edit with either `PATCH` or `PUT`, and confirm before deleting.
- Loading, API error, empty collection, and no matching results states.

## Run checks

```sh
npm run build
npm run lint
```

## Submission screenshots

Capture the populated list, add form, details modal, edit form, delete confirmation, and the `movies` resource with its records open in MockAPI.