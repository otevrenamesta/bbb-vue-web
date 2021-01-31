export default {
  props: ['site'],
  template: `
<header id="header" class="fixed-top d-flex align-items-center">
  <div class="container d-flex align-items-center">

    <div class="logo mr-auto">
      <h1><a href="/">{{ site.title }}</a></h1>
      <!-- Uncomment below if you prefer to use an image logo -->
      <!-- <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->
    </div>

    <nav class="nav-menu d-none d-lg-block">
      <ul>
        <li v-for="i in site.menu">
          <router-link :to="i.link">{{ i.label }}</router-link>
        </li>
      </ul>
    </nav>

    <div class="header-social-links">
      <a href="#" class="twitter"><i class="fab fa-twitter"></i></a>
      <a href="#" class="facebook"><i class="fab fa-facebook"></i></a>
      <a href="#" class="instagram"><i class="fab fa-instagram"></i></a>
    </div>

  </div>
</header>
`
}