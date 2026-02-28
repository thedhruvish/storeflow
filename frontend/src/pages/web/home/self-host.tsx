import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { fadeInUp } from "./helper";

const GITHUB_REPO_LINK = "https://github.com/thedhruvish/storeone";

export const SelfHostSection = () => {
  return (
    <section id='self-host' className='py-24 bg-background'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-bold mb-4 text-muted-foreground'>
              <Github className='h-3 w-3' /> OPEN SOURCE
            </div>

            <h2 className='text-3xl md:text-5xl font-bold mb-6'>
              Self-Host Your Own S3-Compatible Storage
            </h2>

            <p className='text-lg text-muted-foreground mb-8 leading-relaxed'>
              Take full control of your data by running your own storage
              backend. StoreOne is fully open-source and compatible with AWS S3
              APIs, so you can connect any S3-compatible client while hosting on
              your own VPS, serverless, local machine, or even a Raspberry Pi.
              No vendor lock-in. No hidden costs.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={GITHUB_REPO_LINK}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-primary/25'
              >
                <Github className='h-5 w-5' /> Star on GitHub
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`${GITHUB_REPO_LINK}#installation`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-all border border-border'
              >
                Read Docs <ArrowRight className='h-4 w-4' />
              </motion.a>
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUp}
            className='bg-muted/50 rounded-2xl p-6 border font-mono text-sm shadow-2xl overflow-hidden relative'
          >
            <div className='flex gap-2 mb-4 border-b border-border pb-2'>
              <div className='w-3 h-3 rounded-full bg-red-500' />
              <div className='w-3 h-3 rounded-full bg-yellow-500' />
              <div className='w-3 h-3 rounded-full bg-green-500' />
            </div>

            <p className='text-muted-foreground mb-1'># Clone the repository</p>
            <p className='mb-4'>
              <span className='text-green-500'>$</span>{" "}
              <span className='text-blue-400'>git</span>{" "}
              <span className='text-cyan-400'>clone</span>{" "}
              <span className='text-purple-400'>{GITHUB_REPO_LINK}.git</span>
            </p>

            <p className='text-muted-foreground mb-1'>
              # Give execute permission (Linux / macOS)
            </p>
            <p className='mb-4'>
              <span className='text-green-500'>$</span>{" "}
              <span className='text-blue-400'>chmod</span>{" "}
              <span className='text-cyan-400'>+x</span>{" "}
              <span className='text-purple-400'>run.sh</span>
            </p>

            <p className='text-muted-foreground mb-1'># Start the server</p>
            <div className='flex items-center gap-2'>
              <span>
                <span className='text-green-500'>$</span>{" "}
                <span className='text-purple-400'>./run.sh</span>
              </span>
              <span className='animate-pulse text-green-500'>● Running</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
