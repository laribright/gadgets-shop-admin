import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreateOrUpdateProductSchema } from '@/app/admin/products/schema';
import { Input } from '@/components/ui/input';
import { Category } from '@/app/admin/categories/categories.types';
import { Button } from '@/components/ui/button';

type Props = {
  form: UseFormReturn<CreateOrUpdateProductSchema>;
  onSubmit: (data: CreateOrUpdateProductSchema) => void;
  categories: Category[];
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  isProductModalOpen: boolean;
  defaultValues: CreateOrUpdateProductSchema | null;
};

export const ProductForm = ({
  form,
  onSubmit,
  categories,
  setIsProductModalOpen,
  isProductModalOpen,
  defaultValues,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        title: '',
        category: '',
        price: '',
        maxQuantity: '',
        heroImage: undefined,
        images: undefined,
      });
    }
  }, [defaultValues, form]);

  return (
    <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div
          className='max-h-[calc(100svh-200px)] overflow-y-auto'
          style={{
            scrollbarWidth: 'none' /* Firefox */,
            msOverflowStyle: 'none' /* Internet Explorer 10+ */,
          }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid gap-4 py-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter product title'
                        {...field}
                        className='col-span-3'
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          disabled={isSubmitting}
                          className='col-span-3'
                        >
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        id='price'
                        type='number'
                        className='col-span-3'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxQuantity'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Max Quantity</FormLabel>
                    <FormControl>
                      <Input
                        id='maxQuantity'
                        type='number'
                        className='col-span-3'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='heroImage'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        type='file'
                        accept='image/*'
                        {...form.register('heroImage')}
                        onChange={event => {
                          field.onChange(event.target.files?.[0]);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        type='file'
                        accept='image/*'
                        multiple
                        {...form.register('images')}
                        onChange={event => {
                          field.onChange(event.target.files);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button disabled={isSubmitting} type='submit'>
                  Add Product
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
