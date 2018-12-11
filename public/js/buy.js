new Vue ({
    el:"#main",
    data() {
      return {
          count:[],
      };
    },
    methods: {
         getCount(){
             this.count=location.search.split("=")[1];
         }
    },
    created() {
        this.getCount();
    },

  });