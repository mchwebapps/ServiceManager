<template>
  <div class="collapse" id="payment-collapse-form">
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <hr>
          <div class="d-flex justify-content-between pt-2">
            <div class="">
              <h4>Płatność</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <label class="form-label">Rodzaj dokumentu:</label>
          <div class="mb-3">
            <select class="form-select form-select-sm" autocomplete="off">
              <option selected>Faktura</option>
              <option>Paragon</option>
              <option>Umowa kupna-sprzedaży</option>
              <option>Korekta magazynowa</option>
              <option>Inny</option>
            </select>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Rodzaj płatności:</label>
          <div class="mb-3">
            <select class="form-select form-select-sm" autocomplete="off">
              <option selected>Gotówka</option>
              <option>Za pobraniem</option>
              <option>Przelew</option>
              <option>Karta płatnicza</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4">
          <label class="form-label">Cena netto:</label>
          <div class="input-group input-group-sm mb-3">
            <input type="number" class="form-control form-control-sm" value="250,00" step="0.01" autocomplete="off">
            <span class="input-group-text">zł</span>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Opłacono:</label>
          <div class="input-group input-group-sm mb-3">
            <input type="number" class="form-control form-control-sm" value="0,00" step="0.01" autocomplete="off">
            <span class="input-group-text">zł</span>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Cena brutto:</label>
          <div class="input-group input-group-sm mb-3">
            <input type="number" class="form-control form-control-sm" value="307,50" step="0.01" autocomplete="off">
            <span class="input-group-text">zł</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <hr>
          <label class="form-label mt-2">Komentarz:</label>
          <div class="mb-3">
            <input type="text" class="form-control form-control-sm" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#payment-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>