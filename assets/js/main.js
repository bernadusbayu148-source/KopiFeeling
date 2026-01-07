
// Tahun footer
document.getElementById('year').textContent = new Date().getFullYear();

// ==== Terima tinggi konten dari iframe leaderboard via postMessage ====
(function listenLeaderboardHeight(){
  const iframe = document.getElementById('leaderboardFrame');
  if (!iframe) return;

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (data && data.type === 'LB_HEIGHT' && typeof data.height === 'number') {
      // Sesuaikan tinggi iframe agar tidak ada scroll ganda
      iframe.style.height = (data.height + 20) + 'px';
    }
  });
})();
