<template>
  <div class="collapse" id="invoice-collapse-form">
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <hr>
          <div class="d-flex justify-content-between pt-2">
            <div class="">
              <h4>Dane do faktury</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4">
          <div class="mb-3">
            <label class="form-label">Firma:</label>
            <input type="text" class="form-control form-control-sm" value="Izabela Brzozowska-Świątek" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="mb-3">
            <label class="form-label">NIP:</label>
            <input type="text" class="form-control form-control-sm" value="9482114958" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4">
          <label class="form-label">Ulica, nr budynku i lokalu:</label>
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">ul.</span>
            <input type="text" class="form-control form-control-sm" value="Ferdynanda Focha 3" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="mb-3">
            <label class="form-label">Kod pocztowy:</label>
            <input type="text" class="form-control form-control-sm" value="26-600" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="mb-3">
            <label class="form-label">Miejscowość:</label>
            <input type="text" class="form-control form-control-sm" value="Radom" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#invoice-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>