export default {
  props: ['site'],
  template: `
<header id="header" class="navbar navbar-expand-lg">
  <div class="container d-flex align-items-center">

    <div class="logo mr-auto">
      <h1><router-link to="/">{{ site.title }}</router-link></h1>
      <!-- Uncomment below if you prefer to use an image logo -->
      <!-- <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->
    </div>

    <nav class="nav-menu d-none d-lg-block">
      <ul class="navbar-nav">
        <li v-for="i in site.menu" class="nav-item">
          <router-link class="nav-link" :to="i.link">{{ i.label }}</router-link>
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