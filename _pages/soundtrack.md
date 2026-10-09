---
layout: single
title: "Sociology in Stereo"
permalink: /soundtrack/
author_profile: false
description: "Four semesters of Intro to Sociology, one song at a time. Explore what 438 different songs reveal about taste, gender, mood, and the weather."
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">
<script>document.body.classList.add('url--soundtrack');</script>

<div id="soundtrack" data-src="/assets/data/playlist.json">

  <header class="st-hero">
    <p class="st-eyebrow">Intro to Sociology &middot; Fall 2022 to Fall 2024</p>
    <h1 class="st-title">Sociology in Stereo</h1>
    <p class="st-lede">Every class meeting began with a song. Over four semesters my students chose <strong data-count="songs">438</strong> different songs, each one logged with its genre, its language, how the student was feeling, and what the weather looked like outside. Taste feels personal. This playlist shows how much of it is social.</p>
    <ul class="st-stats" aria-label="Playlist at a glance">
      <li><span class="st-stat-num" data-count="songs">0</span><span class="st-stat-label">songs</span></li>
      <li><span class="st-stat-num" data-count="artists">0</span><span class="st-stat-label">artists</span></li>
      <li><span class="st-stat-num" data-count="genres">0</span><span class="st-stat-label">genres</span></li>
      <li><span class="st-stat-num" data-count="langs">0</span><span class="st-stat-label">languages</span></li>
    </ul>
  </header>

  <noscript><p>This page needs JavaScript to show the interactive playlist.</p></noscript>

  <section class="st-section" aria-labelledby="st-find-h">
    <h2 id="st-find-h">Four things the playlist says</h2>
    <div class="st-insights" id="st-insights"></div>
  </section>

  <section class="st-section st-explore" aria-labelledby="st-explore-h">
    <h2 id="st-explore-h">Explore it yourself</h2>
    <p class="st-sub">Pick any filter and every chart and song below updates. Click a bar to filter by it.</p>

    <div class="st-filters" id="st-filters">
      <div class="st-filter-group"><span class="st-filter-label">Semester</span><div id="f-sem" class="st-chips"></div></div>
      <div class="st-filter-group"><span class="st-filter-label">Genre</span><div id="f-fam" class="st-chips"></div></div>
      <div class="st-filter-row">
        <div class="st-filter-group"><span class="st-filter-label">Student who chose it</span><div id="f-resp" class="st-seg"></div></div>
        <div class="st-filter-group"><span class="st-filter-label">Artist</span><div id="f-singer" class="st-seg"></div></div>
        <div class="st-filter-group"><label class="st-filter-label" for="f-lang">Language</label><select id="f-lang"></select></div>
        <div class="st-filter-group st-grow"><label class="st-filter-label" for="f-q">Search</label><input id="f-q" type="search" placeholder="Song or artist" autocomplete="off"></div>
      </div>
      <div class="st-status"><span id="st-count" role="status" aria-live="polite"></span><button type="button" id="st-reset" class="st-link">Clear filters</button></div>
    </div>

    <div class="st-grid">
      <article class="st-card st-wide">
        <h3>Who picks whom?</h3>
        <p class="st-note" id="st-pick-note"></p>
        <div id="c-pick"></div>
      </article>
      <article class="st-card">
        <h3>The sound of the room</h3>
        <div id="c-fam"></div>
      </article>
      <article class="st-card">
        <h3>How each semester sounded</h3>
        <p class="st-note">A song chosen in more than one semester counts in each of them.</p>
        <div id="c-sem"></div>
        <div class="st-legend" id="c-sem-legend"></div>
      </article>
      <article class="st-card">
        <h3>How students were feeling</h3>
        <div id="c-feel"></div>
      </article>
      <article class="st-card">
        <h3>What the sky looked like</h3>
        <div id="c-wx"></div>
      </article>
      <article class="st-card">
        <h3>Most picked artists</h3>
        <ol class="st-artists" id="c-artists"></ol>
      </article>
    </div>
  </section>

  <section class="st-section" aria-labelledby="st-songs-h">
    <div class="st-songs-head">
      <h2 id="st-songs-h">The songs</h2>
      <div class="st-songs-tools">
        <label class="st-filter-label" for="f-sort">Sort</label>
        <select id="f-sort">
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="times">Most often chosen</option>
          <option value="streams">Most streamed</option>
          <option value="az">Title A to Z</option>
        </select>
        <button type="button" id="st-surprise" class="btn">Surprise me</button>
      </div>
    </div>
    <div id="st-featured" class="st-featured" hidden></div>
    <div id="st-songs" class="st-songs"></div>
    <div class="st-more"><button type="button" id="st-more" class="btn btn--inverse">Show more songs</button></div>
  </section>

  <p class="st-method">About the data. Genres and track details come from Spotify and the Chosic genre finder. Moods for the 2024 semesters were generated by AI tools. Each song appears once, even when it was chosen in several semesters, and spelling variants were merged. Students chose their own songs, so this is a record of one set of classrooms, not a statement about everyone. No names or hometowns are shown anywhere on this page.</p>
</div>

<script src="/assets/js/soundtrack.js" defer></script>
