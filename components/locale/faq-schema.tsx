'use client'

import { useEffect, useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const restaurantFAQs: FAQItem[] = [
  {
    question: "What are Dona Theresa's opening hours?",
    answer: "We are open Tuesday to Sunday. Lunch: 12:00 PM - 3:00 PM, Dinner: 6:00 PM - 11:00 PM. We are closed on Mondays."
  },
  {
    question: "Do I need to make a reservation at Dona Theresa?",
    answer: "While walk-ins are welcome when space permits, we highly recommend making a reservation, especially for Friday and Saturday evenings. You can book online or call us at 020 8421 5550."
  },
  {
    question: "Where is Dona Theresa located and is there parking?",
    answer: "We are located at 451 Uxbridge Road, Hatch End, Pinner HA5 4JR. There is free street parking available nearby and we're a short walk from Hatch End station."
  },
  {
    question: "Does Dona Theresa offer vegetarian or vegan options?",
    answer: "Yes, we offer a variety of vegetarian dishes and can accommodate vegan requests. Please inform us of any dietary requirements when booking."
  },
  {
    question: "Is Dona Theresa suitable for special occasions?",
    answer: "Absolutely! We regularly host birthday celebrations, anniversaries, and romantic dinners. We can arrange special touches like celebration cakes - just let us know when booking."
  },
  {
    question: "What is the dress code at Dona Theresa?",
    answer: "We have a smart casual dress code. While we want you to feel comfortable, we maintain an elegant dining atmosphere."
  },
  {
    question: "Does Dona Theresa have a lunch menu?",
    answer: "Yes, we offer a special lunch menu at £19.95 for 2 courses, available Tuesday to Sunday from 12:00 PM to 3:00 PM."
  },
  {
    question: "Can Dona Theresa accommodate large groups?",
    answer: "Yes, we can accommodate groups. For parties of 8 or more, please call us directly at 020 8421 5550 to discuss your requirements."
  },
  {
    question: "What type of cuisine does Dona Theresa serve?",
    answer: "We serve authentic Italian cuisine, featuring fresh ingredients, traditional recipes, and a carefully selected wine list. Our menu includes classic pasta dishes, seafood, meat dishes, and homemade desserts."
  },
  {
    question: "Is Dona Theresa child-friendly?",
    answer: "Yes, families are welcome at Dona Theresa. We can provide high chairs and have options suitable for children."
  }
]

export function FAQSchema() {
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  // Only show FAQ schema on relevant pages
  const showFAQ = ['/', '/about', '/contact', '/reserve'].includes(currentPath)

  if (!showFAQ) return null

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": restaurantFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      {/* Also render the FAQ content for SEO */}
      <div className="hidden" itemScope itemType="https://schema.org/FAQPage">
        {restaurantFAQs.map((faq, index) => (
          <div key={index} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">{faq.question}</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}