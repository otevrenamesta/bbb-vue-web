export default {
  props: ['site'],
  template: `
<footer id="footer" class="bg-dark text-light">
  <div class="container">
    <div class="row">

      <div class="col-lg-4 col-md-6">
        <h3>Pořadatel</h3>
        <p>
          Město Tábor, odbor kultury </br>
          Žižkovo náměstí 11  </br>
          390 01 Tábor  </br>
          info@mutabor.cz <br>
          datová schránka: 5zrb8iz <br>
        </p>
      </div>

      <div class="col-lg-4 col-md-6 footer-links">
        <h4>Užitečné odkazy</h4>
        <ul>
          <li v-for="i in site.menu">
            <router-link :to="i.link">{{ i.label }}</router-link>
          </li>
        </ul>
      </div>

      <div class="col-lg-4 col-md-6 footer-newsletter">
        <h4>Join Our Newsletter</h4>
        <p>Tamen quem nulla quae legam multos aute sint culpa legam noster magna</p>
        <form action="" method="post">
          <input type="email" name="email"><input type="submit" value="Subscribe">
        </form>

        <a href="#" class="back-to-top"><i class="icofont-simple-up"></i>nohoru</a>
      </div>

    </div>
  </div>
  </footer>
`}