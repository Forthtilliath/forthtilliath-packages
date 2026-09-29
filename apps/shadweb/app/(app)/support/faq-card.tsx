import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";

const faqs = [
  {
    question: "How do I invite teammates?",
    answer: 'Go to Team → "Invite member" and enter their email address.',
  },
  {
    question: "Can I export my invoices?",
    answer: "Yes, from the Billing page — pick a date range and download.",
  },
  {
    question: "How do I change my plan?",
    answer:
      "Billing → Plan. Downgrades ask for confirmation since you lose features immediately at renewal.",
  },
];

export function FaqCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently asked questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
