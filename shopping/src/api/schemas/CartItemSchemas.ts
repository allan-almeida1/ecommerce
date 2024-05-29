import Joi from "joi";

const cart_item_schema = Joi.object({
  product_id: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(),
});

const cart_item_amount_schema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
});

export { cart_item_schema, cart_item_amount_schema };
