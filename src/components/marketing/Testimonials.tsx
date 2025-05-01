import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col pb-10 sm:pb-16 lg:pr-8 lg:pb-0 xl:pr-20">
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/tuple-logo-gray-900.svg"
              className="h-12 self-start"
            />
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg/8 text-gray-900">
                <p>
                  &#34;I used to guess where my money was going—now, Walter tells me exactly where
                  it’s been and where it should go next. With effortless tracking of expenses and
                  income, plus weekly AI-powered insights, I’m finally seeing my net worth grow. No
                  more random purchases or investment guesswork. Walter makes managing money feel
                  easy, even for someone like me who’s always been a little financially
                  clueless.&#34;
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">Judith Black</div>
                  <div className="mt-1 text-gray-500">CEO of Tuple</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-20">
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/reform-logo-gray-900.svg"
              className="h-12 self-start"
            />
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg/8 text-gray-900">
                <p>
                  &#34;Walter took my finances from ‘what on earth is happening here?’ to ‘I’m
                  actually growing my net worth!’ With automatic expense and income tracking, AI
                  insights, and a weekly newsletter that feels like it’s written just for me, Walter
                  has turned me into a financial grown-up. It’s like having a personal money coach,
                  but without the awkward ‘I told you so’ moments.&#34;
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">Joseph Rodriguez</div>
                  <div className="mt-1 text-gray-500">CEO of Reform</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
