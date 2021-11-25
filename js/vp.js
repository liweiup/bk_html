var app = new Vue({
    el: '#app',
        data: {
            industry: [
                ["行业","60px"],
                ["交易额占市值(百分比)","150px"],
                ["流通市值","150px"],
                ["成交额","120px"],
                ["净额(亿)","130px"],
            ],
            individual: [
                ["股票","80px","individual_code"],
                ["涨跌幅","270px","avg_rose_ratio"],
                ["换手率","270px","avg_turnover_ratio"],
                ["量比","190px","avg_relative"],
                ["振幅","280px","avg_amplitude_ratio"],
                ["成交额","300px","avg_ob_rise_price"],
                ["流通市值","90px","circulate_value"],
                ["当前价格","90px","now_price"],
                ["市盈率","90px","pe"],
                ["流通股","90px","circulate_stock"],
            ],
            active:"industry",
            param:{
                "compareNum": 2,
                "periodNum": 3,
                "fundType": 2,
                "individual_code":"",
                "cdate":''
            },
            table_th:[],
            todos: [],
            industry_sel:[],
    },
    created:function(){
        this.handle_data("",this.active);
        this.param.cdate = get_now_date();
        Vue.set(this,'table_th',this.industry);
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
            this.reset_param()
            ob = this;
            if (event) {
                $(event.target).parent("div").find("a").removeClass("active");
                $(event.target).addClass("active");
            }
            var index = layer.load(1, {
                time: 2*1000,
                shade: [0.4,'#fff'] //0.1透明度的白色背景
            });
            switch (this.active) {
                case 'individual':
                    ob.get_individual_data(function() {
                        Vue.set(ob,'table_th',ob.individual);
                        layer.close(index);
                    })
                    break;
                case 'industry':
                    break;
                case '':
                    break;
                default:
                    break;
            }
        },
        get_industry_data: function (next_step = "") {
            var vm = this
            var param = this.param;
            vm.$http.post(host + '/api/getPlateBankrollData',param).then(function (response) {
                if (response.data.code == 0) {
                    Vue.set(this,'todos',response.data.data);
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
            if (event) {
                $(event.target).closest("tr").find("th").removeClass("cur");
                $(event.target).parent("th").addClass("cur");
            }
            var todos = this.todos;
            todos.sort(function(a,b) {
                if (flag == "pe") 
                {
                    if (b[flag] == 0) {
                        b[flag] = 1000
                    }
                    if (a[flag] == 0) {
                        a[flag] = 1000
                    }
                    return a[flag] - b[flag];
                }
                return b[flag] - a[flag];
            });
            Vue.set(this,'todos',todos);
        }
    }
    
})