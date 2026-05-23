fetch('https://google.com')
  .then(res => console.log('Google Status:', res.status))
  .catch(err => console.error('Google Error:', err));

fetch('https://bcricdgzteffyvpsmaze.supabase.co')
  .then(res => console.log('Supabase Status:', res.status))
  .catch(err => console.error('Supabase Error:', err));
