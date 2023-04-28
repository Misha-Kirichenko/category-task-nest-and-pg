<h1>About API</h1>
<p>
  API can: add, delete, partially update and do <strong>diacritic independent</strong> search on category/categories. Usage details are avaliable after installing and runnin api in related Swagger Open API docs
</p>
<h2>About key feature</h2>
<p>You can find a category written with diacritics by a parameter "search" passed in without diacritics. For example, by passing the word "Мед" you can find the category "Мёд" and vice versa. The problem was solved by adding an extension to PostgreSQL during docker container build process through the bash script</p>
</p>
<hr>
<h2 align="center">API installation and run instructions</h1>
<hr>
<ul>
  <li>Clone repository</li>
  <li>Create .env file. Take example.env as example</li>
  <li>Build docker container via: <code>docker-compose up --build</code></li>
  <li>Open browser at http://localhost:4000/api</li>
</ul>
