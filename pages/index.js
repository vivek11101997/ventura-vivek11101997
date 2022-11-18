import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout/layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SetItemToLocalStorage from "../global/localStorage/SetItemToLocalStorage";
import { useFlags } from "flagsmith/react";
import { mobileRegister } from "../global/path/redirectPath";
export default function Home() {
  const cob_base_url_prod1 = useFlags(["cob_base_url_prod"]);
  const cob_base_url_prod = cob_base_url_prod1["cob_base_url_prod"].value;
  const cob_base_url_stage1 = useFlags(["cob_base_url_stage"]);
  const cob_base_url_stage = cob_base_url_stage1["cob_base_url_stage"].value;
  const cob_base_url_qa1 = useFlags(["cob_base_url_qa"]);
  const cob_base_url_qa = cob_base_url_qa1["cob_base_url_qa"].value;

  useEffect(() => {
    const object = {
      cob_base_url_prod,
      cob_base_url_qa,
      cob_base_url_stage,
    };
    SetItemToLocalStorage("url", object);
  }, [cob_base_url_prod, cob_base_url_stage, cob_base_url_qa]);
  const router = useRouter();
  useEffect(() => {
    void router.push(mobileRegister);
  }, []);
  return (
    <>
      <Head>
        <title>Ventura</title>
        <link rel="shortcut icon" href="/images/fevicon.png" />
      </Head>
      <div className={styles.container}>
        <Layout></Layout>
      </div>
    </>
  );
}
