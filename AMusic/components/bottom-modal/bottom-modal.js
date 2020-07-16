// components/bottom-modal/bottom-modal.js
Component({
  properties: {
    isModalShow: Boolean
  },
  options:{
    addGlobalClass: true,
    // styleIsolation: apply-shared
    multipleSlots: true
  },
  data: {

  },
  methods: {
    onClose(){
      this.setData({
        isModalShow: false
      })
    }
  }
})
