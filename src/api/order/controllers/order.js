'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const { generateCodUid } = require('../../../utils/generateCustomUid');

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
      // Access the request body directly
      // @ts-ignore
      const { products, fullName, email, phoneNumber, division, district, fullAddress, deliveryCharge, estimatedDeliveryTime, comments } = ctx.request.body;
  
      try {
        // Fetch product details and calculate total amount
        const productDetails = await Promise.all(
          products.map(async (product) => {
            const item = await strapi.service('api::product.product').findOne(product.id);
  
            if (!item) {
              throw new Error(`Product with ID ${product.id} not found`);
            }
  
            return {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: product.quantity,
              total: item.price * product.quantity,
            };
          })
        );
  
        // Calculate total order amount
        const totalAmount = productDetails.reduce((sum, product) => sum + product.total, 0);
  
        
        // Generate a custom UID
        const CodGatewayId = generateCodUid();
        
        // Create the order with COD payment method
        const order = await strapi.service('api::order.order').create({
          data: {
            products: productDetails, // Save detailed product information
            payment_method: 'COD', // Set payment method to COD
            status: 'Ordered', // Initial status for COD
            total_amount: totalAmount, // Save the total amount of the order
            CodGatewayId: CodGatewayId,

            fullName,
            email,
            phoneNumber,
            division,
            district,
            // deliveryCharge,
            // estimatedDeliveryTime,
            fullAddress,
            comments,
          }
        });
  
    //     // Redirect to a success page
    //     ctx.redirect(`${process.env.CLIENT_URL}/success`);
    //     return { order };
    //   } catch (error) {
    //     ctx.response.status = 500;
    //     return { error: error.message };
    //   }

            // Return success response instead of redirecting
            return ctx.send({ 
                order, 
                CodGatewayId, // Include CodGatewayId in the response
                message: 'Order created successfully!' 
            });
        } catch (error) {
            ctx.response.status = 500;
            return ctx.send({ error: error.message });
        }
    },
  
    async updateOrderStatus(ctx) {
      // Access the request body directly
      // @ts-ignore
      const { id, status } = ctx.request.body;
  
      // Define valid statuses
      const validStatuses = [
        // 'intake',
        'Ordered',
        'Cancelled',
        'Packed',
        'Shipped',
        // 'on_the_way',
        'Reached',
        'Deadly Cancelled',
        'Delivered',
      ];
  
      // Validate status
      if (!validStatuses.includes(status)) {
        return ctx.badRequest('Invalid status');
      }
  
      // Find the existing order
      const order = await strapi.entityService.findOne('api::order.order', id);
  
      if (!order) {
        return ctx.notFound('Order not found');
      }
  
      // Update the status
      const updatedOrder = await strapi.entityService.update('api::order.order', id, {
        // @ts-ignore
        data: { status },
      });
  
      return ctx.send(updatedOrder);
    },
  }));