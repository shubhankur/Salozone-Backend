const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
   name:{
       type:String,
       required:true
   },

   mobileNumber: {
    type: String,
    required: true,
    max: 10
    },
    booking:{
        type:Schema.Types.ObjectId,
        ref:'Booking'
    },
    address:{
        pincode:{
            type:Number
        },
       locality:{
           type:String
       },
       district:{
           type:String
       },
       state:{
           type:String
       },
       latitude:{
           type:String
       },
       longitude:{
           type:String
       }
    },
    // googleLocation:{
    //     type:[Number]
    // },
    unmatchedSkills:{
        type:[String]
    },
    LeaveDay:{
        type:String
    },
    LeaveDate:{
       type:String
    },
    Isavailable:{
        
    avlat_ten:{
        type:Boolean,
        default:false
    },
    avlat_tenthirty:{
        type:Boolean,
        default:false
    },
    avlat_eleven:{
        type:Boolean,
        default:false
    },
    avlat_eleventhirty:{
        type:Boolean,
        default:false
    },
    avlat_twelve:{
        type:Boolean,
        default:false
    },
    avlat_twelvethirty:{
        type:Boolean,
        default:false
    },
    avlat_one:{
        type:Boolean,
        default:false
    },
    avlat_onethirty:{
        type:Boolean,
        default:false
    },
    avlat_two:{
        type:Boolean,
        default:false
    },
    avlat_twothirty:{
        type:Boolean,
        default:false
    },
    avlat_three:{
        type:Boolean,
        default:false
    },
    avlat_threethirty:{
        type:Boolean,
        default:false
    },
    avlat_four:{
        type:Boolean,
        default:false
    },
    avlat_fourthirty:{
        type:Boolean,
        default:false
    },
    avlat_five:{
        type:Boolean,
        default:false
    },
    avlat_fivethirty:{
        type:Boolean,
        default:false
    },

}
})

const Employee=mongoose.model('employee',employeeSchema)

module.exports=Employee