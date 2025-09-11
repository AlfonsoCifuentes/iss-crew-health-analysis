import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // This can either be defined statically at the top-level of the file
  // or based on a dynamic value from the request
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
