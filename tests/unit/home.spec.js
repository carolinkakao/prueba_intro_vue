import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Vista Home", () => {
  //test que evalua presenncia de texto
  test("Presencia de Título", () => {
    const wrapper = shallowMount(Home);
    const h1 = wrapper.find("h1");
    const titulo = "<em>Programate Esta Pizza</em>";
    expect(h1.text()).toBe(titulo)
  })

  //test para evaluar presencia de clase
  test("Presencia de clase Título", () => {
    const wrapper = shallowMount(Home);
    const titulo = wrapper.find(".titulo");
    expect(titulo.exists()).toBe(true);
  })
})

