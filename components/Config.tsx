import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const formSchema = z.object({
  twitterHandle: z
    .string({
      required_error: 'Please enter your Twitter handle.',
    })
    .min(2)
    .max(50),
  enableLists: z.boolean(),
});

export const Config = ({
  onDataSubmit,
  initialData,
}: {
  onDataSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twitterHandle: '',
      enableLists: true,
    },
  });

  useEffect(() => {
    // Reset the form with initial data
    form.reset(initialData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    onDataSubmit(data);
    toast('Your settings have been saved!');
    window.location.hash = 'all_locations';
  }

  return (
    <div className='flex justify-center items-center'>
      <Card className='w-full p-4 mx-auto text-gray-200 shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle>Get started</CardTitle>
          <CardDescription>Enter your Twitter handle below.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='twitterHandle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter handle</FormLabel>
                    <FormControl>
                      <Input placeholder='mohamed3on' className='max-w-96' {...field} />
                    </FormControl>
                    <FormDescription>
                      Note: when you input a handle for the first time, we will need to load Twitter
                      to fetch your data. This might take a few seconds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='enableLists'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 shadow'>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Include your lists in the analysis</FormLabel>
                      <FormDescription>
                        Includes members if lists you created or subscribed to in the analysis.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type='submit' className='mr-auto'>
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
