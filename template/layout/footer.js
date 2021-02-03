export default {
  props: ['site'],
  template: `
<footer id="footer">

    <div class="footer-top">
      <div class="container">
        <div class="row">

          <div class="col-lg-4 col-md-6 footer-contact">
            <h3>Otevřená města, z. s.</h3>
            <p>
              Malinovského náměstí 624/3 <br>
              602 00 Brno<br>
              <strong>info@otevrenamesta.cz <br>
              <strong>datová schránka: f47yb4g <br>
            </p>
          </div>

          <div class="col-lg-4 col-md-6 footer-links">
            <h4>Useful Links</h4>
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
          </div>

        </div>
      </div>
    </div>

    <div class="container d-md-flex py-4">

      <div class="mr-md-auto text-center text-md-left">
        <div class="copyright">
          Copyleft <strong><span>Otevřená města</span></strong>. All Rights Removed
        </div>
      </div>
    </div>
    <a href="#" class="back-to-top"><i class="icofont-simple-up"></i></a>
  </footer>
`}