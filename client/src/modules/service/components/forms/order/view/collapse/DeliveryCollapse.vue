<template>
  <div class="collapse" id="delivery-collapse-form">
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <hr>
          <div class="d-flex justify-content-between pt-2">
            <div class="">
              <h4>Dostawa</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4">
          <label class="form-label">Sposób dostarczenia:</label>
          <div class="mb-3">
            <select class="form-select form-select-sm" autocomplete="off">
              <option selected>Dostarczenie osobiste</option>
              <option>Wysyłka kurierem</option>
            </select>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Rodzaj dostawy:</label>
          <select class="form-select form-select-sm mb-3" autocomplete="off">
            <option selected>Odbiór osobisty</option>
            <option>Wysyłka kurierem</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Koszt dostawy:</label>
          <div class="input-group input-group-sm mb-3">
            <input type="number" class="form-control form-control-sm" value="0,00" step="0.01" autocomplete="off">
            <span class="input-group-text">zł</span>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#delivery-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>