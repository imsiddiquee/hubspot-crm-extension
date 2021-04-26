# How Can We explore New Feature of Hubspot CRM Extension 


In HubSpot, the company object is closely attached with deals and the deal object has one too many relations with product line items.
My CRM extension shows analytical summary of product line items along with price quantity based on  custom field carriers In company page on the right sidebar




## Overview

HubSpot company object 2 types of associations one is parent another child. each child company has one too many relationships with product line items, In the company information, there is no scope or option to see product line items information. So here the problem arises how can you get the analytical summary of a line item with different carriers? Furthermore, there is no direct API available to know about the company to product line item information.

One of my client's requirements was to know about the deals product line item information on the company page directly.My project structure was simple so that anyone can understand it easily. To reach the goal I had to build the extension on the NODE js environment. I used HubSpot APIs namely associations, fetch deals, fetch company information, based on HubSpot data this API helped me to collect data from HubSpot then I manipulated the data to store data in MongoDB for caching. It loads from the cache data and does not need to be fetched again within 20 days for better performance in viewing data.

### Project requirement presentation

![card-requirement-overview](https://github.com/imsiddiquee/crm-extension/blob/main/postContent/card-requirement-overview.png)

### Project presentation

![Project-Presentation](https://github.com/imsiddiquee/crm-extension/blob/main/postContent/Project-Presentation.png)

### What is CRM Extension

The extension basically is like adding a door to explore outside from your comfort. You can utilize any outsider programming apparatus within your Hub Spot CRM, as long as you have a joining. The integration gives you the opportunity to utilize outsider applications.

## Here we can learn:

```
• How to use HubSpot API to retrieve hub data.
• Manipulation of HubSpot data to prepare an analytical summary.
• Way to work with CRM extension actions, as my card view detail.
• Cache data for better performance.
• On property object array; a way to calculate the accumulated sum.
• Group by objects based on property.
• Sorted by objects based on property.

```
