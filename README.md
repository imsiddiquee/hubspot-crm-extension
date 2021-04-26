# CRM extension can be used to enhance hubspot objects scope.

Company object is closely attached with deals and deal object has one to many relation with product line items. My CRM extension shows any company's analytical summary of product line items along with price quantity based on different categories from custom field carrier.

## Overview

HubSpot company object 2 type of associations one is parent another child.each child company has one to many relationship with product line items, In the company information there is no scope or option to see product line items information.So here problem arises
how can you get the analytical summary of a line item with different carriers? Further more there is no direct API available
to know about company to product line item information.

One of my clients requirement was to know about the deals product line item information in the company page directly.
My project structure was simple so that any one can understand easily. To reach the goal I had build the extension on NODE js environment.
I used HubSpot APIs namely associations,fetch deals,fetch company information,based on HubSpot data this API helped me to collect data from HubSpot then I manipulated the date to store data in mongodb for caching. It loads from the cache data and does not need to be fetched again within 20 days for better performance in viewing data.

### Project requirement presentation

![card-requirement-overview](https://github.com/imsiddiquee/crm-extension/blob/main/postContent/card-requirement-overview.png)

### Project presentation

![Project-Presentation](https://github.com/imsiddiquee/crm-extension/blob/main/postContent/Project-Presentation.png)

### What is CRM Extension

Extension basically is like adding a door to explore outside from your comfort. You can utilize any outsider programming apparatus within your Hub Spot CRM, as long as you have a joining. Integration gives you the opportunity to utilize outsider application.

## Here we can learn:

```
• How to use HubSpot api to retrived hub data.
• Manipulation hubspot data to prepare analytical summary.
• Way to work with crm extension actions, like my card view detail.
• Cache data for better performance.
• On property object array; a way to calculate the accumulated sum.
• Group by objects based on property.
• Sorted by objects based on property.
```
