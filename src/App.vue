<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "App"
};
</script>

<style>
html {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>