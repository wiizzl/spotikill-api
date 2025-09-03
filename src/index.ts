import { swagger } from "@elysiajs/swagger";
import { Elysia, status, t } from "elysia";

import { Status, type User } from "@/generated/prisma";
import { AlbumPlain } from "@/generated/prismabox/Album";
import { PlaylistPlain } from "@/generated/prismabox/Playlist";
import { SignupRequestPlain } from "@/generated/prismabox/SignupRequest";
import { SongPlain } from "@/generated/prismabox/Song";

import { prisma } from "@/lib/prisma";

const app = new Elysia({ prefix: "/api" })
  .use(
    swagger({
      documentation: {
        info: {
          title: "Streaming Musical API",
          version: "1.0.0",
        },
      },
    }),
  )
  .post(
    "/signup",
    async ({ body }) => {
      try {
        await prisma.signupRequest.create({
          data: {
            email: body.email,
            password: body.password,
            first_name: body.first_name,
            last_name: body.last_name,
          },
        });
      } catch {
        return status(400, { message: "La requête est mal formulée" });
      }

      return status(201, { message: "Demande d'inscription ajoutée avec succès" });
    },
    {
      body: t.Object({
        email: t.String({ format: "email", description: "Adresse email de l'utilisateur" }),
        password: t.String({ format: "password", description: "Mot de passe de l'utilisateur" }),
        confirm_password: t.String({
          format: "password",
          description: "Confirmation du mot de passe de l'utilisateur",
        }),
        first_name: t.String({ description: "Prénom de l'utilisateur" }),
        last_name: t.String({ description: "Nom de famille de l'utilisateur" }),
      }),
      response: {
        201: t.Object(
          {
            message: t.String({ examples: ["Demande d'inscription ajoutée avec succès"] }),
          },
          { description: "Demande d'inscription ajoutée avec succès" },
        ),
        400: t.Object(
          {
            message: t.String({ examples: ["La requête est mal formulée"] }),
          },
          { description: "La requête est mal formulée" },
        ),
      },
      tags: ["Signup"],
      detail: {
        summary: "Crée une nouvelle demande d'inscription",
        description:
          "Crée une nouvelle demande d'inscription et l'ajoute à la base de données du service de streaming musical",
      },
    },
  )
  .get(
    "/signup",
    async () => {
      const requests = await prisma.signupRequest.findMany({ orderBy: { id: "desc" } });

      return status(200, { signup: requests });
    },
    {
      response: {
        200: t.Object(
          {
            signup: t.Array(SignupRequestPlain),
          },
          { description: "OK" },
        ),
      },
      tags: ["Signup"],
      detail: {
        summary: "Récupère la liste des demande d'inscription",
        description: "Récupère la liste des demande d'inscription sur le service de streaming musical",
      },
    },
  )
  .put(
    "/signup/:id/accept",
    async ({ params }) => {
      try {
        await prisma.signupRequest.update({
          where: { id: params.id },
          data: {
            status: Status.accepted,
          },
        });
      } catch {
        return status(404, { message: "La demande d'inscription n'existe pas" });
      }

      return status(200, { message: "Demande d'inscription acceptée avec succès" });
    },
    {
      params: t.Object({
        id: t.Integer({ description: "ID de la demande d'inscription" }),
      }),
      response: {
        200: t.Object(
          {
            message: t.String({ examples: ["Demande d'inscription acceptée avec succès"] }),
          },
          { description: "Demande d'inscription acceptée avec succès" },
        ),
        404: t.Object(
          {
            message: t.String({ examples: ["La demande d'inscription n'existe pas"] }),
          },
          { description: "La demande d'inscription n'existe pas" },
        ),
      },
      tags: ["Signup"],
      detail: {
        summary: "Accepter une demande d'inscription",
      },
    },
  )
  .put(
    "/signup/:id/reject",
    async ({ params }) => {
      try {
        await prisma.signupRequest.update({
          where: { id: params.id },
          data: {
            status: Status.rejected,
          },
        });
      } catch {
        return status(404, { message: "La demande d'inscription n'existe pas" });
      }

      return status(200, { message: "Demande d'inscription refusée avec succès" });
    },
    {
      params: t.Object({
        id: t.Integer({ description: "ID de la demande d'inscription" }),
      }),
      response: {
        200: t.Object(
          {
            message: t.String({ examples: ["Demande d'inscription refusée avec succès"] }),
          },
          { description: "Demande d'inscription refusée avec succès" },
        ),
        404: t.Object(
          {
            message: t.String({ examples: ["La demande d'inscription n'existe pas"] }),
          },
          { description: "La demande d'inscription n'existe pas" },
        ),
      },
      tags: ["Signup"],
      detail: {
        summary: "Refuser une demande d'inscription",
      },
    },
  )
  .get(
    "/songs",
    async () => {
      const songs = await prisma.song.findMany({ orderBy: { title: "asc" } });

      return status(200, { songs });
    },
    {
      response: {
        200: t.Object(
          {
            songs: t.Array(SongPlain),
          },
          { description: "OK" },
        ),
      },
      tags: ["Songs"],
      detail: {
        summary: "Récupère une liste de chansons",
        description: "Récupère une liste de chansons disponibles sur le service de streaming musical",
      },
    },
  )
  .post(
    "/songs",
    async ({ body }) => {
      try {
        const album = await prisma.album.findUnique({
          where: { id: body.album_id },
        });

        if (!album) {
          return status(404, { message: "L'album n'existe pas" });
        }

        await prisma.song.create({
          data: {
            title: body.title,
            artist: body.artist,
            album_id: body.album_id,
          },
        });
      } catch {
        return status(400, { message: "La requête est mal formulée" });
      }

      return status(201, { message: "Chanson ajoutée avec succès" });
    },
    {
      body: t.Object(
        {
          title: t.String({ description: "Titre de la chanson" }),
          artist: t.String({ description: "Artiste de la chanson" }),
          album_id: t.Integer({ description: "Identifiant unique de l'album" }),
        },
        { description: "Chanson à ajouter" },
      ),
      response: {
        201: t.Object(
          {
            message: t.String({ examples: ["Chanson ajoutée avec succès"] }),
          },
          { description: "Chanson ajoutée avec succès" },
        ),
        404: t.Object(
          {
            message: t.String({ examples: ["L'album n'existe pas"] }),
          },
          { description: "L'album n'existe pas" },
        ),
        400: t.Object(
          {
            message: t.String({ examples: ["La requête est mal formulée"] }),
          },
          { description: "La requête est mal formulée" },
        ),
      },
      tags: ["Songs"],
      detail: {
        summary: "Ajoute une nouvelle chanson",
        description: "Ajoute une nouvelle chanson à la bibliothèque de musique du service de streaming musical",
      },
    },
  )
  .get(
    "/song/:id",
    async ({ params }) => {
      const song = await prisma.song.findUnique({
        where: { id: params.id },
      });

      if (!song) {
        return status(404, { message: "La chanson n'existe pas" });
      }

      return status(200, { song });
    },
    {
      params: t.Object({
        id: t.Integer({ description: "ID de la chanson à récupérer" }),
      }),
      response: {
        200: t.Object(
          {
            song: SongPlain,
          },
          { description: "OK" },
        ),
        404: t.Object(
          {
            message: t.String({ examples: ["La chanson n'existe pas"] }),
          },
          { description: "La chanson n'existe pas" },
        ),
      },
      tags: ["Songs"],
      detail: {
        summary: "Récupère une chanson par ID",
        description: "Récupère une chanson par son identifiant unique",
      },
    },
  )
  .get(
    "/playlists",
    async () => {
      const playlists = await prisma.playlist.findMany({ orderBy: { id: "asc" } });

      return status(200, { playlists });
    },
    {
      response: {
        200: t.Object(
          {
            playlists: t.Array(PlaylistPlain),
          },
          { description: "OK" },
        ),
      },
      tags: ["Playlists"],
      detail: {
        summary: "Récupère une liste de playlists",
        description: "Récupère une liste de playlists disponibles sur le service de streaming musical",
      },
    },
  )
  .post(
    "/playlists",
    async ({ body }) => {
      try {
        const songs = await prisma.song.findMany({
          where: { id: { in: body.songs } },
        });

        if (songs.length !== body.songs.length) {
          return status(404, { message: "La chanson n'existe pas" });
        }

        await prisma.playlist.create({
          data: {
            title: body.title,
            author: body.author,
            songs: body.songs,
          },
        });
      } catch {
        return status(400, { message: "La requête est mal formulée" });
      }

      return status(201, { message: "Playlist ajoutée avec succès" });
    },
    {
      body: t.Object({
        title: t.String({ description: "Titre de la playlist" }),
        author: t.String({ description: "Auteur de la playlist" }),
        songs: t.Array(t.Integer({ description: "Identifiant unique de la chanson" })),
      }),
      response: {
        201: t.Object(
          {
            message: t.String({ examples: ["Playlist ajoutée avec succès"] }),
          },
          { description: "Playlist ajoutée avec succès" },
        ),
        400: t.Object(
          {
            message: t.String({ examples: ["La requête est mal formulée"] }),
          },
          { description: "La requête est mal formulée" },
        ),
        404: t.Object(
          { message: t.String({ examples: ["La chanson n'existe pas"] }) },
          { description: "La chanson n'existe pas" },
        ),
      },
      tags: ["Playlists"],
      detail: {
        summary: "Crée une nouvelle playlist",
        description: "Crée une nouvelle playlist et l'ajoute à la base de données du service de streaming musical",
      },
    },
  )
  .get(
    "/albums",
    async () => {
      const albums = await prisma.album.findMany({
        include: { songs: { orderBy: { title: "asc" } } },
        orderBy: { release_date: "desc" },
      });

      return status(200, { albums });
    },
    {
      response: {
        200: t.Object(
          {
            albums: t.Array(
              t.Object({
                ...AlbumPlain.properties,
                songs: t.Array(SongPlain, { description: "Liste des chansons de l'album." }),
              }),
              {
                description: "Liste des albums récupérés avec succès",
              },
            ),
          },
          { description: "OK" },
        ),
      },
      tags: ["Albums"],
      detail: {
        summary: "Récupérer tous les albums",
        description: "Cette API permet de récupérer tous les albums disponibles dans le service de streaming musical.",
      },
    },
  )
  .post(
    "/albums",
    async ({ body }) => {
      try {
        await prisma.album.create({
          data: {
            title: body.title,
            artist: body.artist,
            release_date: body.release_date,
          },
        });
      } catch {
        return status(400, { message: "La requête est mal formulée" });
      }

      return status(201, { message: "Album créé avec succès" });
    },
    {
      body: t.Object({
        title: t.Optional(t.String({ description: "Titre de l'album." })),
        artist: t.Optional(t.String({ description: "Nom de l'artiste qui a créé l'album." })),
        release_date: t.Optional(t.String({ format: "date", description: "Date de sortie de l'album." })),
      }),
      response: {
        201: t.Object(
          { message: t.String({ examples: ["Album créé avec succès."] }) },
          { description: "Album créé avec succès." },
        ),
        400: t.Object(
          {
            message: t.String({ examples: ["La requête est mal formulée"] }),
          },
          { description: "La requête est mal formulée" },
        ),
      },
      tags: ["Albums"],
      detail: {
        summary: "Créer un nouvel album",
        description: "Cette API permet de créer un nouvel album dans le service de streaming musical.",
      },
    },
  )
  .get(
    "/stats",
    async ({ query }) => {
      let user: User | null;

      if (query.user_id) {
        user = await prisma.user.findUnique({ where: { id: query.user_id } });
      }

      try {
        switch (query.type) {
          case "artists": {
            break;
          }
          case "albums": {
            break;
          }
          case "songs": {
            break;
          }
          case "playing_time": {
            break;
          }
          default:
            return status(400, { message: "La requête est mal formulée" });
        }
      } catch {
        return status(400, { message: "La requête est mal formulée" });
      }
    },
    {
      query: t.Object({
        type: t.UnionEnum(["artists", "albums", "songs", "playing_time"], {
          description: "Type de statistique à récupérer.",
        }),
        user_id: t.Optional(
          t.Integer({
            description: "Identifiant de l'utilisateur dont les statistiques doivent être récupérées.",
          }),
        ),
        from: t.Optional(
          t.String({
            description: "Date de début de la période sur laquelle récupérer les statistiques au format YYYY-MM-DD.",
          }),
        ),
        to: t.Optional(
          t.String({
            description: "Date de fin de la période sur laquelle récupérer les statistiques au format YYYY-MM-DD.",
          }),
        ),
      }),
      response: {
        200: t.Object(
          {
            stats: t.Object({
              albums: t.Optional(
                t.Array(
                  t.Object({
                    time: t.Integer({ examples: [3185] }),
                    title: t.String({ examples: ["Led Zeppelin IV"] }),
                    artist: t.String({ examples: ["Led Zeppelin"] }),
                  }),
                  {
                    description: "Liste des 3 albums les plus écoutés quand le type est albums.",
                  },
                ),
              ),
              songs: t.Optional(
                t.Array(
                  t.Object({
                    time: t.Integer({ examples: [2275] }),
                    title: t.String({ examples: ["Black Dog"] }),
                    artist: t.String({ examples: ["Led Zeppelin"] }),
                  }),
                  {
                    description: "Liste des 3 morceaux les plus écoutés quand le type est songs.",
                  },
                ),
              ),
              artists: t.Optional(
                t.Array(
                  t.Object({
                    time: t.Integer({ examples: [3185] }),
                    artist: t.String({ examples: ["Led Zeppelin"] }),
                  }),
                  {
                    description: "Liste des 3 artistes les plus écoutés quand le type est artists.",
                  },
                ),
              ),
              playing: t.Optional(
                t.Integer({
                  description: "Temps d'écoute total quand le type est playing_time.",
                  examples: 5008,
                }),
              ),
            }),
          },
          {
            description: "Statistiques récupérées avec succès.",
          },
        ),
        400: t.Object(
          {
            message: t.String({ examples: ["La requête est mal formulée"] }),
          },
          { description: "La requête est mal formulée" },
        ),
      },
      tags: ["Stats"],
      detail: {
        summary: "Récupérer des statistiques sur l'utilisation du service de streaming musical",
        description:
          "Cette API permet de récupérer des statistiques sur l'utilisation du service de streaming musical, telles que les genres musicaux préférés, le nombre de morceaux écoutés, le temps d'écoute total, le temps d'écoute par utilisateur, la musique la plus écoutée de l'année, du mois et de la semaine.",
      },
    },
  )
  .listen(8080);

console.log(
  `🎵 Streaming Musical API (swagger) is running at http://${app.server?.hostname}:${app.server?.port}/api/swagger`,
);
