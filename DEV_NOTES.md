# Dev Notes

## Docker

#### COPY always as 'root' user
- The `COPY` instruction sets the copied files with `root` user.
- Use `--chowm` if we need to set another user.
- `COPY --chown=${USER_GROUP} ./src ./src`

#### ENV vs. ARG
- `ENV` should be used for environment variables for the running software.
- `ARG` should be used for arguments inside the docker file.

#### Good practice: do not run processes as root
Running processes in the container as the root user is a precarious security practice: use a low privileged user and proper filesystem permissions. Builder stages are run as root because 1) it requires less docker instructions and 2) as far as I know - it does not represent a security issue. 

#### Good practice: do not run the app as PID1
> PID 1 is special in unix, and so omitting an init system often leads to incorrect handling of processes and signals, and can result in problems such as containers which can't be gracefully stopped, or leaking containers which should have been destroyed. In Linux, processes in a PID namespace form a tree with each process having a parent process. Only one process at the root of the tree doesn't really have a parent. This is the "init" process, which has PID 1.

**Solution**: use `tini` or `dumb-init`.
- If PID1 is our app, it does not handle child-process signals, so they remain as zombie with reserved resources.
- When PID1 is 'tini' and our app terminates, the init system takes care of cleaning the process table.



## References
- https://towardsdev.com/writing-a-docker-file-for-your-node-js-typescript-micro-service-c5170b957893
- https://snyk.io/wp-content/uploads/10-best-practices-to-containerize-Node.js-web-applications-with-Docker.pdf
- https://petermalmgren.com/pid-1-child-processes-docker/
- https://gist.github.com/StevenACoffman/41fee08e8782b411a4a26b9700ad7af5
