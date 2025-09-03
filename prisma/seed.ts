import { Status } from "@/generated/prismabox/Status";

import { prisma } from "@/lib/prisma";

async function main() {
  // Albums
  await prisma.album.createMany({
    data: [
      { id: 1, title: "A Night at the Opera", artist: "Queen", release_date: new Date("1975-07-16") },
      { id: 2, title: "Led Zeppelin IV", artist: "Led Zeppelin", release_date: new Date("1982-07-14") },
      { id: 3, title: "Thriller", artist: "Michael Jackson", release_date: new Date("1984-07-11") },
    ],
  });

  // Users
  await prisma.user.createMany({
    data: [
      { id: 1, email: "admin@email.com", password: "password", first_name: "Admin", last_name: "Admin" },
      { id: 2, email: "user1@email.com", password: "password", first_name: "User1", last_name: "User1" },
      { id: 3, email: "user2@email.com", password: "password", first_name: "User2", last_name: "User2" },
    ],
  });

  // Songs
  await prisma.song.createMany({
    data: [
      { id: 1, title: "Bohemian Rhapsody", artist: "Queen", album_id: 1 },
      { id: 2, title: "You're My Best Friend", artist: "Queen", album_id: 1 },
      { id: 3, title: "Love of My Life", artist: "Queen", album_id: 1 },
      { id: 4, title: "Black Dog", artist: "Led Zeppelin", album_id: 2 },
      { id: 5, title: "Rock and Roll", artist: "Led Zeppelin", album_id: 2 },
      { id: 6, title: "Stairway to Heaven", artist: "Led Zeppelin", album_id: 2 },
      { id: 7, title: "Thriller", artist: "Michael Jackson", album_id: 3 },
      { id: 8, title: "Beat It", artist: "Michael Jackson", album_id: 3 },
      { id: 9, title: "Billie Jean", artist: "Michael Jackson", album_id: 3 },
    ],
  });

  // Playlists
  await prisma.playlist.createMany({
    data: [
      { id: 1, title: "Rock Classics", author: "John Doe", songs: [3, 6, 4] },
      { id: 2, title: "80s Pop", author: "John Doe", songs: [2, 9, 3] },
    ],
  });

  // SignupRequests
  await prisma.signupRequest.createMany({
    data: [
      {
        id: 1,
        email: "john.doe@email.com",
        password: "password",
        first_name: "John",
        last_name: "Doe",
        status: Status.pending,
      },
      {
        id: 2,
        email: "john.doe2@email.com",
        password: "password",
        first_name: "John",
        last_name: "Doe",
        status: Status.pending,
      },
    ],
  });

  // Playings
  const now = new Date();
  await prisma.playing.createMany({
    data: [
      { id: 1, user_id: 1, song_id: 4, time: 455, playing_at: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { id: 2, user_id: 1, song_id: 4, time: 455, playing_at: new Date(now.getTime() - 1 * 60 * 60 * 1000) },
      { id: 3, user_id: 1, song_id: 4, time: 455, playing_at: new Date(now.getTime() - 30 * 60 * 1000) },
      { id: 4, user_id: 1, song_id: 4, time: 455, playing_at: new Date(now.getTime() - 15 * 60 * 1000) },
      { id: 5, user_id: 1, song_id: 6, time: 455, playing_at: new Date(now.getTime() - 10 * 60 * 1000) },
      { id: 6, user_id: 1, song_id: 5, time: 455, playing_at: new Date(now.getTime() - 5 * 60 * 1000) },
      { id: 7, user_id: 2, song_id: 4, time: 455, playing_at: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { id: 8, user_id: 2, song_id: 7, time: 234, playing_at: new Date(now.getTime() - 1 * 60 * 60 * 1000) },
      { id: 9, user_id: 3, song_id: 2, time: 567, playing_at: new Date(now.getTime() - 30 * 60 * 1000) },
      { id: 10, user_id: 3, song_id: 1, time: 567, playing_at: new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000) }, // ~2 months ago
      { id: 11, user_id: 1, song_id: 1, time: 455, playing_at: new Date(now.getTime() - 4 * 30 * 24 * 60 * 60 * 1000) }, // ~4 months ago
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
