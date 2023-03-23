import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

export type Params = {
  screenName: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Record<string, never>, Params> = async ({ params }) => {
  return {
    redirect: {
      statusCode: 308,
      destination: `/u/${params?.screenName}`,
    },
    revalidate: 60 * 60,
  };
};

const Page: NextPage = () => {
  return null;
};

export default Page;
