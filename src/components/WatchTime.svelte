<script>
    export let data;

    const animeWatchTime = data.animeData.current.concat(data.animeData.watched, data.animeData.dropped)
        .reduce((total, anime) => {
            const episodesWatched = anime.episodesProgress || anime.episodesNumber || 0;
            return total + (episodesWatched * anime.episodesDuration);
        }, 0);
    
    const movieWatchTime = data.watchedMovies.watched
        .reduce((total, movie) => {
            return total + (movie.movieRuntime || 0);
        }, 0);

    const totalWatchTime = animeWatchTime + movieWatchTime;

    const animeWatchPercentage = totalWatchTime > 0 ? Math.round((animeWatchTime / totalWatchTime) * 100) : 0;

    function convertToDaysHours(minutes) {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return { days, hours };
    }
</script>

<div class="watchtime">
    <h2>watch time</h2>
    <svg viewBox="0 0 36 36" class="circular-chart">
        <path class="circle bg"
          stroke-dasharray="100"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      <path class="circle"
        stroke-dasharray="{animeWatchPercentage}, 100"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="14" class="percentage">{convertToDaysHours(totalWatchTime).days} days</text>
      <text x="18" y="20" class="percentage anime">{convertToDaysHours(animeWatchTime).days} days anime</text>
      <text x="18" y="24" class="percentage movie">{convertToDaysHours(movieWatchTime).days} days movies</text>
    </svg>
</div>

<style>
    .watchtime {
        background: var(--background-2);

        display: flex;
        flex-direction: column;
        padding: 0px 16px 16px 16px;
        /* gap: 18px; */

        /* width: 353px; */
        height: 292px;

        border-radius: 17px;
        overflow-y: auto;
    }

    h2 {
        all: unset;
        font-size: 2rem;
        font-weight: 500;
    }

/* https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705 */

.circular-chart {
  display: block;
  /* margin: 10px auto; */
  /* max-width: 80%; */
  max-height: 250px;
}

.circular-chart .circle {
    stroke: var(--app-accent);
}

.circle {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
}

.circle.bg {
    stroke: var(--app-accent-dark);
}

.percentage {
  font-size: 0.22em;
  text-anchor: middle;
}

.percentage.anime {
    color: var(--app-accent);
}

.percentage.movie {
    color: var(--app-accent-dark);
}

svg {
    height: revert;
}
</style>