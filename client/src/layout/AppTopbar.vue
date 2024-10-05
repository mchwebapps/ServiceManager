<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <button class="btn btn-sm btn-secondary" @click="toggleMenu">
          <i class="bi bi-list"></i>
      </button>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
          <li class="nav-item active"><a class="nav-link" href="https://hurtgsm.visualstudio.com/iAdmin" target="_blank">iAdmin</a></li>
          <!-- <li class="nav-item"><a class="nav-link" href="#!">Link</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#!">Action</a>
              <a class="dropdown-item" href="#!">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#!">Something else here</a>
            </div>
          </li> -->
          <li class="nav-item"><a class="nav-link" href="" @click.prevent="logout()">Wyloguj</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useBodyClass } from "@/store/bodyClass"
import { useCurrentUser } from "@/store/user"

const bodyClass = useBodyClass()
const userStore = useCurrentUser()

const toggleMenu = () => {
  const activeClasses = bodyClass.getBodyClass.split(' ')
 
  if (activeClasses.some(x=>x == 'sidebar-toggled')) {
      const newBodyClass = activeClasses.filter(x=>x != 'sidebar-toggled').join(' ')
      bodyClass.setBodyClass(newBodyClass)
      return
    }    
    activeClasses.push('sidebar-toggled')
    const newBodyClass=activeClasses.join(' ')
    bodyClass.setBodyClass(newBodyClass)
}

const logout = () => {
  userStore.logout()
}
</script>
