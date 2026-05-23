const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

fetch('https://bcricdgzteffyvpsmaze.supabase.co')
  .then(res => console.log('Status:', res.status))
  .catch(err => console.error('Error:', err.message));
