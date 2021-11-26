var app = new Vue({
    el: '#app',
        data: {
             plate: [
                ["板块","200px",""],
                ["涨跌幅","270px","avg_rose_ratio"],
                ["成交额","340px","avg_ob_rise_price"],
                ["成交量","280px","avg_ob_rise_volume"],
                ["净流入额","260px","avg_fund_real_in"],
                ["均价","200px","avg_price"],
                ["上涨家数","100px","rise_company_num"],
                ["下跌家数","100px","drop_company_num"],
            ],
            individual: [
                ["股票","80px","individual_code"],
                ["涨跌幅","270px","avg_rose_ratio"],
                ["换手率","270px","avg_turnover_ratio"],
                ["量比","190px","avg_relative"],
                ["振幅","280px","avg_amplitude_ratio"],
                ["成交额","300px","avg_ob_rise_price"],
                ["当前价格","150px","now_price"],
                ["流通市值","90px","circulate_value"],
                ["市盈率","80px","pe"],
                ["流通股","90px","circulate_stock"],
            ],
            active:"individual",
            param:{
                "compareNum": 1,
                "periodNum": 5,
                "individual_code":"000088,002739,600031,600183,600211,603987",
                "cdate":''
            },
            table_th:[],
            todos: [],
            industry_sel:[],
    },
    created:function(){
        this.handle_data("",this.active);
        Vue.set(this,'table_th',this[this.active]);
    },
    methods: {
        reset_param: function() {
            var compareNum = parseInt($("input[name='compareNum']").val());
            var periodNum = parseInt($("input[name='periodNum']").val());
            var cdate = $("input[name='cdate']").val();
            var individual_code = $("#industry_sel option:selected").attr("value");
            if (compareNum) {
                this.param.compareNum = compareNum;
            }
            if (periodNum) {
                this.param.periodNum = periodNum;
            }
            if (cdate) {
                this.param.cdate = cdate;
            }
            if (individual_code) {
                this.param.individual_code = individual_code;
            }
        },
        handle_data: function(event,flag) {
            this.active = flag ? flag : this.active;
            this.param.cdate = get_now_date();
            this.reset_param()
            ob = this;
            if (event) {
                $(event.target).parent("div").find("a").removeClass("active");
                $(event.target).addClass("active");
            }
            var index = layer.load(1, {
                shade: [0.4,'#fff'] //0.1透明度的白色背景
            });
            switch (this.active) {
                case 'individual':
                    ob.get_individual_data(function() {
                        Vue.set(ob,'table_th',ob.individual);
                        layer.close(index);
                    })
                    break;
                case 'plate':
                     ob.get_plate_data(function() {
                        Vue.set(ob,'table_th',ob.plate);
                        layer.close(index);
                    })
                    break;
                case '':
                    break;
                default:
                    break;
            }
        },
        get_plate_data: function (next_step = "") {
            var vm = this
            var param = this.param;
            vm.$http.post(host + '/api/getPlateBankrollData',param).then(function (response) {
                if (response.data.code == 0) {
                    Vue.set(this,'todos',response.data.data);
                    next_step && next_step();
                }
            }).catch(function (error) {
                vm.answer = 'Error! Could not reach the API. ' + error
            })
        },
        get_individual_data: function (next_step = "") {
            var vm = this
            var param = this.param;
            
            vm.$http.post(host + '/api/getPlateGroup',{}).then(function (response) {
                if (response.data.code == 0) {
                    Vue.set(this,'industry_sel',response.data.data);
                }
            }).catch(function (error) {
                vm.answer = 'Error! Could not reach the API. ' + error
            })

            vm.$http.post(host + '/api/getStockBankrollData',param).then(function (response) {
                if (response.data.code == 0) {
                    Vue.set(this,'todos',response.data.data);
                    next_step && next_step();
                }
            }).catch(function (error) {
                vm.answer = 'Error! Could not reach the API. ' + error
            })

        },
        get_float: function (number,n) {
            number *= 100
            n = n ? parseInt(n) : 0;
            if(n <= 0) {
                return Math.round(number);
            }
            number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
            number = Number(number).toFixed(n); //补足位数
            return number + '%';
        },
        tow_number(val) {      
            return val.toFixed(2)    
        },
        get_upper: function (value) {
            var pre_fix = String(value).indexOf('-') == -1 ? '' : '-';
            value = Math.abs(Number(value));
            if(value>100000000)
                return pre_fix + (value/100000000).toFixed(2)+"亿";
            else if(value>100000)
                return  pre_fix + Math.floor(value/10000)+"万";
            else if(value>10000)
                return  pre_fix + (value/10000).toFixed(2)+"万";
            else return  pre_fix + value;
        },
        sort_data(event,flag) {
            var index = layer.load(1, {
                shade: [0.4,'#fff'] //0.1透明度的白色背景
            });
            if (event) {
                $(event.target).closest("tr").find("th").removeClass("cur");
                $(event.target).parent("th").addClass("cur");
            }
            var todos = this.todos;
            todos.sort(function(a,b) {
                if (flag == "pe") 
                {
                    return a[flag] - b[flag];
                }
                return b[flag] - a[flag];
            });
            Vue.set(this,'todos',todos);
            layer.close(index);
        }
    }
    
})