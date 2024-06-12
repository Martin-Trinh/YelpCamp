const basedJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension =  (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers){
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        })
        if(clean !== value) return helpers.error('string.escapeHTML', {value})
        return clean
      }
    
    }
  }
})

const joi = basedJoi.extend(extension)


module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        // image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required(),
    }).required(),
    deleteImage: joi.array()
})

module.exports.reviewSchema = joi.object({
  review: joi.object({
    body: joi.string().required(),
    rating: joi.number().required().max(5)
  }).required() 
})

