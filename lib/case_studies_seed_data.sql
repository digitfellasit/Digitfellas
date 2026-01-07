-- Insert sample case studies data from Selected Work section

INSERT INTO case_studies (id, title, slug, content, excerpt, short_description, client_name, industry, project_url, meta_title, meta_description, is_featured, is_published, published_at, completed_at, sort_order)
VALUES
    (
        gen_random_uuid(),
        'E-Commerce Platform Redesign',
        'ecommerce-platform-redesign',
        '# Project Overview

We partnered with a leading retail brand to completely redesign their e-commerce platform, focusing on user experience, performance, and conversion optimization.

## Challenge

The client''s existing platform was outdated, slow, and had a high cart abandonment rate. They needed a modern solution that could handle high traffic volumes during peak shopping seasons.

## Solution

- Built a headless commerce architecture using Next.js and Shopify
- Implemented advanced product filtering and search
- Optimized for mobile-first experience
- Integrated with existing inventory and CRM systems

## Results

- 45% increase in conversion rate
- 60% faster page load times
- 30% reduction in cart abandonment
- Successfully handled 10x traffic during Black Friday',
        'Complete redesign of a major e-commerce platform resulting in 45% conversion increase and 60% faster load times.',
        'Modern e-commerce platform with headless architecture',
        'Major Retail Brand',
        'E-Commerce',
        NULL,
        'E-Commerce Platform Redesign Case Study',
        'Learn how we redesigned a major e-commerce platform, achieving 45% conversion increase and 60% faster performance.',
        true,
        true,
        NOW(),
        NOW() - INTERVAL '2 months',
        1
    ),
    (
        gen_random_uuid(),
        'Healthcare Portal Development',
        'healthcare-portal-development',
        '# Project Overview

Developed a comprehensive patient portal for a healthcare provider network, enabling secure communication between patients and healthcare providers.

## Challenge

The healthcare network needed a HIPAA-compliant solution for patient communication, appointment scheduling, and medical record access.

## Solution

- Built secure portal with end-to-end encryption
- Implemented real-time appointment scheduling
- Integrated with existing EHR systems
- Mobile-responsive design for accessibility

## Results

- 80% reduction in phone call volume
- 95% patient satisfaction rate
- Improved appointment show-up rates by 25%
- Reduced administrative overhead by 40%',
        'HIPAA-compliant patient portal enabling secure communication and reducing phone call volume by 80%.',
        'Secure healthcare portal with real-time scheduling',
        'Healthcare Provider Network',
        'Healthcare',
        NULL,
        'Healthcare Portal Development Case Study',
        'Discover how we built a HIPAA-compliant patient portal that reduced phone calls by 80% and improved patient satisfaction.',
        true,
        true,
        NOW() - INTERVAL '1 month',
        NOW() - INTERVAL '3 months',
        2
    ),
    (
        gen_random_uuid(),
        'Financial Dashboard & Analytics',
        'financial-dashboard-analytics',
        '# Project Overview

Created a comprehensive financial analytics dashboard for a fintech startup, providing real-time insights and reporting capabilities.

## Challenge

The client needed to visualize complex financial data in an intuitive way while ensuring data security and compliance.

## Solution

- Built interactive dashboard using React and D3.js
- Implemented real-time data streaming
- Created custom reporting engine
- Ensured SOC 2 compliance

## Results

- Reduced report generation time from hours to seconds
- Enabled data-driven decision making
- Improved client retention by 35%
- Scaled to handle 1M+ transactions daily',
        'Real-time financial analytics dashboard processing 1M+ daily transactions with instant reporting.',
        'Interactive financial dashboard with real-time analytics',
        'Fintech Startup',
        'Financial Services',
        NULL,
        'Financial Dashboard & Analytics Case Study',
        'See how we built a real-time financial analytics dashboard that processes 1M+ transactions daily.',
        true,
        true,
        NOW() - INTERVAL '2 weeks',
        NOW() - INTERVAL '1 month',
        3
    ),
    (
        gen_random_uuid(),
        'Supply Chain Automation',
        'supply-chain-automation',
        '# Project Overview

Automated supply chain operations for a manufacturing company, integrating multiple systems and reducing manual processes.

## Challenge

The client had fragmented systems across warehouses, suppliers, and distribution centers, leading to inefficiencies and errors.

## Solution

- Built centralized automation platform
- Integrated with existing ERP and WMS systems
- Implemented AI-powered demand forecasting
- Created mobile apps for warehouse staff

## Results

- 70% reduction in manual data entry
- 50% improvement in inventory accuracy
- 40% faster order fulfillment
- $2M annual cost savings',
        'Supply chain automation platform reducing manual work by 70% and saving $2M annually.',
        'AI-powered supply chain automation platform',
        'Manufacturing Company',
        'Manufacturing',
        NULL,
        'Supply Chain Automation Case Study',
        'Learn how we automated supply chain operations, reducing manual work by 70% and saving $2M annually.',
        false,
        true,
        NOW() - INTERVAL '3 weeks',
        NOW() - INTERVAL '4 months',
        4
    );

