<template>
  <div class="collapse" id="customer-collapse-form">
    <div class="container-fluid bg-light border border-secondary border-opacity-10 rounded px-4 py-3">
      <div class="row">
        <div class="col-12">
          <!-- <div class="d-flex justify-content-between pt-2">
            <div class=""> -->
              <h4 class="border-bottom pb-3">Dane klienta</h4>
            <!-- </div>
          </div> -->
        </div>
      </div>
      <div class="row mt-1">
        <div class="col-3">
          <p class="fw-bold">Konto: <span class="lead fs-6 ms-2">ibs@poczta.onet.pl</span></p>
        </div>
        <div class="col-3">
          <p class="fw-bold">Czarna lista: <span class="lead fs-6 ms-2">Nie</span></p>
        </div>
      </div>
      <hr class="mt-0">
      <div class="row">
        <div class="col-12 col-md-3">
          <div class="mb-3">
            <label class="form-label">Imię:</label>
            <input type="text" class="form-control form-control-sm" value="Izabela" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="mb-3">
            <label class="form-label">Nazwisko:</label>
            <input type="text" class="form-control form-control-sm" value="Brzozowska-Świątek" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="mb-3">
            <label class="form-label">E-mail:</label>
            <input type="text" class="form-control form-control-sm" value="ibs@poczta.onet.pl" autocomplete="off">
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="mb-3">
            <label class="form-label">Telefon:</label>
            <input type="text" class="form-control form-control-sm" value="793164445" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#customer-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>