export function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is Dona Theresa Italian Restaurant located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dona Theresa is located at 451 Uxbridge Road, Hatch End, Pinner HA5 4JR, Northwest London. We're just 5 minutes from Pinner Station and offer free parking for our guests."
        }
      },
      {
        "@type": "Question",
        "name": "What are Dona Theresa's opening hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We're open Tuesday to Sunday. Lunch service: 12:00 PM - 3:00 PM. Dinner service: 6:00 PM - 11:00 PM. We're closed on Mondays. Last orders are taken at 10:30 PM."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to make a reservation at Dona Theresa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we highly recommend making a reservation, especially for Friday and Saturday evenings. You can book online through our website or call us at 020 8421 5550."
        }
      },
      {
        "@type": "Question",
        "name": "What type of cuisine does Dona Theresa serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve authentic Italian fine dining with a modern twist. Our menu features fresh pasta made daily, wood-fired pizzas, premium seafood, and traditional Italian dishes using imported ingredients from Italy."
        }
      },
      {
        "@type": "Question",
        "name": "Does Dona Theresa offer vegetarian and vegan options?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer a variety of vegetarian dishes and can accommodate vegan requests. Please inform us of any dietary requirements when making your reservation, and our chef will be happy to prepare something special for you."
        }
      },
      {
        "@type": "Question",
        "name": "Is there parking available at Dona Theresa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer free parking for our guests. There's also street parking available on Uxbridge Road and nearby streets. The restaurant is wheelchair accessible."
        }
      },
      {
        "@type": "Question",
        "name": "Does Dona Theresa host private events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we can accommodate private events, celebrations, and business dinners. We offer exclusive hire options and customized menus. Please contact us at 020 8421 5550 to discuss your requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What is the dress code at Dona Theresa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We maintain a smart casual dress code. While we don't require formal attire, we appreciate when guests dress appropriately for a fine dining experience."
        }
      },
      {
        "@type": "Question",
        "name": "Does Dona Theresa offer takeaway or delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We focus on providing an exceptional dine-in experience. However, we do offer takeaway for some menu items. Please call us at 020 8421 5550 to inquire about takeaway options."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Dona Theresa special compared to other Italian restaurants in Pinner?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dona Theresa has been serving award-winning Italian cuisine since 2011. We're known for our intimate atmosphere, exceptional service, extensive wine list, and authentic dishes prepared by our experienced Italian chef. Our commitment to quality and consistency has made us a favorite destination for special occasions in Northwest London."
        }
      }
    ]
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData)
      }}
    />
  )
}
