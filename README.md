<h1 align="center">About API</h1>
<h2>Technogies stack:</h2>
<ul>
  <li>Nest.js / TypeScript</li>
  <li>TypeORM / PostgreSQL</li>
  <li>Swagger</li>
  <li>Docker</li>
  <li>Bash</li>
</ul>
<h2 align="center">Key features</h2>
  <ul>
    <li>Filtering categories by</li>
    <ul>
      <li>name</li>
      <li>description</li>
      <li>search</li>
    </ul>
    <li>Sorting categories by given fields in both ASC and DESC directions</li>
    <li>Diacritic independent search. For example, by passing the word "Мед" as search param you can find the category "Мёд" and vice versa</li>
  </ul>
<hr>
<h2 align="center">API installation and run instructions</h1>
<hr>
<ul>
  <li>Clone repository</li>
  <li>Create .env file. Take example.env as example</li>
  <li>Build docker container via: <code>docker compose up --build</code></li>
  <li>Open browser at http://localhost:4000/api</li>
</ul>
