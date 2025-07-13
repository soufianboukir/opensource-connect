"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }


const faqs = [
  {
    question: 'What is Opensource-connect?',
    answer:
      'Opensource-connect is a platform that connects developers with open-source projects and teams actively looking for contributors.',
  },
  {
    question: 'Is it free to use?',
    answer:
      'Yes, Opensource-connect is completely free for both developers and project maintainers.',
  },
  {
    question: 'Who can join?',
    answer:
      'Any developer with basic knowledge of version control and collaboration tools like GitHub can join and start contributing.',
  },
  {
    question: 'How do I join a project?',
    answer:
      'Simply browse the listed projects, view details, and request to join. Project maintainers will review and onboard new contributors.',
  },
  {
    question: 'What kind of projects are available?',
    answer:
      'You’ll find a wide range of open-source projects including web apps, APIs, tools, and utilities using popular stacks like React, Node.js, Laravel, Python, and more.',
  },
  {
    question: 'Do I need to be experienced to contribute?',
    answer:
      'No. Many projects welcome beginners and label good-first-issue tasks. You can learn and contribute at the same time.',
  },
  {
    question: 'Can I create my own project and invite contributors?',
    answer:
      'Yes. Maintainers can list their projects on Opensource-connect, define roles they’re looking for, and onboard contributors via GitHub.',
  },
];
export default function FAQSection() {
  return (
    <section className="py-24 bg-white dark:bg-muted/10 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-0"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="hover:bg-gray-100 duration-200 px-2 rounded-md dark:hover:bg-muted/30">
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-balance text-gray-700 dark:text-gray-400 text-md">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
