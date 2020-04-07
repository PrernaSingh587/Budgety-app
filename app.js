let budgetController = (function()
                       {
   
//some code
    var expense = function(id, description, value)
    {
        this.id =id;
        this.description=description;
        this.value= value;
        this.perc=-1;
    };
    
    expense.prototype.calcper=function(totalincome)
{
       if(totalincome>0) 
           this.perc=Math.round((this.value/totalincome)*100);
        else 
            this.perc=-1;
    };
    
    expense.prototype.getperc=function()
    {
        return this.perc;
    }
    
    
    
    
    var income = function(id, description, value)
    {
        this.id =id;
        this.description=description;
        this.value= value;
    };
    
    let data = {
        allItems :
        {
            exp:[],
            inc:[]
        },
        totals :
        {
            exp : 0,
            inc : 0
        },
        budget:0,
        percentage:-1,
        
    };
    var calculateTotal = function(type)
    {
        var sum=0;
        data.allItems[type].forEach(function(curr){
            sum=sum+curr.value;
           
        });
        
        data.totals[type]=sum;
    };
    
    
    
    
    
    return {
        addItem : function(type,des,val){
            var newItem;
            if(data.allItems[type].length>0)
             id = data.allItems[type][data.allItems[type].length-1].id+1;
            // ?? ; -------inc/exp---[length-of_inc_exp minus 1]------------+1
            //                       ---------value-------------
            else
                id =0;
            if(type==='exp')
            newItem = new expense(id,des,val);
            else if (type === 'inc') 
                newItem = new income(id,des,val); 
            data.allItems[type].push(newItem);  //objects get into exp[] or inc[]. also p.t = p["t"] and p.t() = p["t"]();
            
            return newItem;
                
        },
        
        calculateBudget: function()
        {
          calculateTotal('exp');
            calculateTotal('inc');
            
            data.budget = data.totals.inc - data.totals.exp; // creating new property of the objects data
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            
        },
        getB : function()
        {
          return{
              budget: data.budget,
              totalInc : data.totals.inc,
              totalExp : data.totals.exp,
              percentage : data.percentage,
          }  
        },
        testing : function()
        {
            console.log(data);
        },
        deleteItem :function(type,id)
        {
            let ids = data.allItems[type].map(function(current)
                                              {
                return current.id;
            });
            let index = ids.indexOf(id);
            
            if(index!== -1)
                {
                    data.allItems[type].splice(index, 1);
                }
            budgetController.calculateBudget();
            
        },
       
        calcPERCENT:function()
        {
            data.allItems.exp.forEach(function(cur)
                                     {
               cur.calcper(data.totals.inc); 
            });
        },
        getPERCENT :function()
        {
           let f= data.allItems.exp.map(function(cur){
                return cur.getperc();
            });
            return f;
        }
        
    };
    
    
    
    
    
})();
//console.log(budgetController.p());

let UIcontroller = (function(){
     var Domstrings = {
         inputType: '.add__type',
         descp: '.add__description',
         val: '.add__value',
         press: '.add_btn',
         iContainer: '.income__list',
         eContainer : '.expenses__list',
         budgetLabel : '.budget__value',
         incomeLabel :'.budget__income--value',
         expenseLabel : '.budget__expenses--value',
         percentageLabel: '.budget__expenses--percentage',
         container :'.container',
         
     }     
     
     
     
    return {
        getinput: function()
        {  return{
             type:document.querySelector(Domstrings.inputType).value,
             description :document.querySelector(Domstrings.descp).value,
             value :parseFloat(document.querySelector(Domstrings.val).value), //parsefloat returns the first number that it encounters in the string. 023 = 023 // 0x3=0 (first number)
        }
        },
        addListItem : function(obj,type)
        {  var html,newHTML;
            //create HTML string with placeholder text
            if (type==='inc')
                {html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%p%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                 element = Domstrings.iContainer;
                }
         else if (type === 'exp')
             {
                 html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%p%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                 element = Domstrings.eContainer;
             }
            
            //replace the placeholder text with some actual data
            newHTML = html.replace('%id%',obj.id); //returns replaced html;
            newHTML = newHTML.replace('%p%',obj.description);
          newHTML=newHTML.replace('%value%',obj.value);
            
            
            // insert the HTML into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend',newHTML); // elememt k end hone se pehle newHTML dalega
         
          },
        getDomstrings: function(){
            return Domstrings;
        },
        
        clearF: function (){
    let fields = document.querySelectorAll(Domstrings.val+ ',' + Domstrings.descp ); // returnss a list which is similar to array but we cant perform certain functions or looping in an array
    let fieldsarr = Array.prototype.slice.call(fields); //by this way, we can return a list
    fieldsarr.forEach(function(current,index,array){        // another way of looping
       current.value=""; 
    });
fieldsarr[0].focus(); //so that the cursor goes to descp/
    },
    
      displayBudget: function(obj)
        {
            document.querySelector(Domstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(Domstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(Domstrings.expenseLabel).textContent = obj.totalExp;
            if(obj.percentage>0)
            document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage+"%";
            else
                document.querySelector(Domstrings.percentageLabel).textContent= "---";
            
        },
        
                deleteITEM :function(selectorID)
        {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        }
}
        
})();


let controller = (function(bdgtctrl,uictrl)
                 { 
    
    var updateBudget = function()
    {
        bdgtctrl.calculateBudget();
        
        var budget = bdgtctrl.getB();
        
        uictrl.displayBudget(budget);
    }
    
    
    let ctrladd= function()        // third
    {    //1. get the filled input data
     var input = uictrl.getinput();
        if (input.description!=""&&!isNaN(input.value)&&input.value>0)
        {
           //2. add the item to bdgt contrl 
        var newitem = bdgtctrl.addItem(input.type,input.description,input.value);
     //3. add the item to display ui
        uictrl.addListItem(newitem,input.type);
        uictrl.clearF();
        //4. calculate budget
        updateBudget();
            
            updateper();
    
         
         
        }
    };
    
    let ctrldelete = function(event)
    {
       let itemID=(event.target.parentElement.parentNode.parentNode.parentElement.id);
        if(itemID)
            {
                let splitID= itemID.split('-'); //returns an array ["inc", "0"];
                let type = splitID[0];
                let ID = +splitID[1];
                // delete the item from the data structure
                bdgtctrl.deleteItem(type,ID);
                
                // delete the item from the UI
                uictrl.deleteITEM(itemID);
                
                //update the budget and show
                updateBudget();
                
                updateper();
            }
    }
    
    
    let setUpEventListeners = function ()     // second
    { let uidom = uictrl.getDomstrings();
        document.querySelector(uidom.press).addEventListener('click',ctrladd);
        document.addEventListener("keypress",function(event)
                                 {
            if(event.which=== 13 || event.keycode===13)
                ctrladd();
        })
        
     document.querySelector(uidom.container).addEventListener('click',ctrldelete);
     
     
    };
    setUpEventListeners();
    
    var updateper= function()
    {
        //1. calc perc
        
        bdgtctrl.calcPERCENT();
        //2. read them frm the bdgtctrl
        var g=bdgtctrl.getPERCENT();
        //3. display them
        console.log(g);
    }
    
    
 
})(budgetController, UIcontroller);




