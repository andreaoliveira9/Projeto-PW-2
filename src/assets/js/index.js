async function loadIndexData() {
  let data = await loadData("assets/data/index-data.json");
  renderFeatures(data.features);
  renderFeaturedResources(data.featuredResources);
  renderTestimonials(data.testimonials);
}

function renderFeatures(features) {
  let container = document.getElementById("features-container");
  if (container == null) {
    return;
  }

  let html = "";
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    html += '<article class="col-md-4">';
    html += '<div class="card h-100 border-0 shadow-sm">';
    html += '<div class="card-body p-4">';
    html += '<div class="icon mb-3">';
    html += '<i class="bi ' + feature.icon + ' fs-2 text-primary"></i>';
    html += "</div>";
    html += '<h3 class="h5">' + feature.title + "</h3>";
    html += '<p class="mb-0">' + feature.description + "</p>";
    html += "</div>";
    html += "</div>";
    html += "</article>";
  }
  container.innerHTML = html;
}

function renderFeaturedResources(resources) {
  let container = document.getElementById("featured-resources-container");
  if (container == null) {
    return;
  }

  let html = "";
  for (let i = 0; i < resources.length; i++) {
    let resource = resources[i];
    html += '<article class="col-lg-4">';
    html += '<div class="card h-100 border-0 shadow">';
    html +=
      '<img src="' +
      resource.image +
      '" class="card-img-top" alt="' +
      resource.imageAlt +
      '" />';
    html += '<div class="card-body">';
    html +=
      '<span class="badge ' +
      resource.badgeClass +
      ' mb-3">' +
      resource.badge +
      "</span>";
    html += '<h3 class="h5">' + resource.title + "</h3>";
    html += '<p class="mb-3">' + resource.description + "</p>";
    html += '<ul class="list-unstyled small mb-4">';
    for (let j = 0; j < resource.highlights.length; j++) {
      let isLast = j === resource.highlights.length - 1;
      html += '<li class="' + (isLast == true ? "" : "mb-2") + '">';
      html += '<i class="bi bi-dot text-primary me-2"></i>';
      html += resource.highlights[j];
      html += "</li>";
    }
    html += "</ul>";
    html +=
      '<a href="' +
      resource.link +
      '" class="btn btn-outline-primary w-100">' +
      resource.buttonText +
      "</a>";
    html += "</div>";
    html += "</div>";
    html += "</article>";
  }
  container.innerHTML = html;
}

function renderTestimonials(testimonials) {
  let container = document.getElementById("testimonials-container");
  if (container == null) {
    return;
  }

  let html = "";
  for (let i = 0; i < testimonials.length; i++) {
    let testimonial = testimonials[i];
    html += '<article class="col-md-6">';
    html +=
      '<div class="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 p-4 border rounded-4 shadow-sm h-100">';
    html +=
      '<img src="' +
      testimonial.image +
      '" class="rounded-circle flex-shrink-0" width="80" height="80" alt="' +
      testimonial.imageAlt +
      '" />';
    html += '<blockquote class="mb-0">';
    html += '<p class="mb-2">"' + testimonial.quote + '"</p>';
    html += '<footer class="blockquote-footer mt-2">';
    html += testimonial.author + ", " + testimonial.year;
    html += "</footer>";
    html += "</blockquote>";
    html += "</div>";
    html += "</article>";
  }
  container.innerHTML = html;
}

loadIndexData();
