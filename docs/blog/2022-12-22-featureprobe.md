---
slug: FeatureProbe BranchingAndFlags
title: 分支管理工具:特性分支 VS 特性开关
---

来源：DevOps.com

作者：Pete Hodgson

英文原文链接：[https://devops.com/feature-branching-vs-feature-flags-whats-right-tool-job/
](https://devops.com/feature-branching-vs-feature-flags-whats-right-tool-job/
)

软件开发团队的代码分支管理策略会对其发布高质量软件的速度产生重大影响，这篇文章我们将探讨在同一代码库中实现多个并行开发工作流的几种不同方法的利弊。我们将看到两个主要的因素：合并代码冲突的成本以及独立发布功能的能力通常是无法兼得的，但特性开关为我们提供了一种解决这种矛盾思路。


![1.jpg](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_geCeiCKrxUbjhJEayJPn)


# 一、代码合并冲突问题
新产品开始时代码库还比较小，通常只有少数几个开发人员在开发，这种情况下不需要太多的正式开发流程规范。然而，即使一个团队只有两个开发人员，在同一时间处理相同的文件时仍需要尽量避免合并冲突。

尽管大家努力避免工作内容互相影响，但看起来毫不相关的工作分支，经常还是会修改到同一个文件。有时，正是这些意外的合并冲突会造成巨大的痛苦 -- 任何一个资深的iOS开发者想必都经历过合并第三方 XIB 文件的冲突问题。在这篇文章中，我们将探讨一些不同的方法来处理多个开发人员在同一代码库中工作时造成合并冲突的挑战。

有些人可能会说，现在的合并冲突并不是什么大问题，使用现代的版本管理工具，例如Git，基本都能解决，这是一种理想状态。现代版本管理工具确实让创建分支变得十分简单，但并不总是能使合并这些分支内的并行开发代码变得简单。Git 有一些强大的功能，在可能的情况下自动合并代码，但 Git 不能解决所有合并问题。如果并行修改影响到了大型的 XML 文件、或 XIB、IDE 工程文件，Git 是无法自动化解决这些合并冲突问题。

最重要的是，Git 无法自动解决代码语义冲突。例如，在一个分支中，Alice 重新命名了一个方法，而在另一个分支中，Bob 增加了该方法的一个新调用。当这两个分支合并时，Git 就无法识别出 Bob 的分支正在调用一个使用旧名称的方法, 而 Bob 的代码正在调用一个已经不存在的方法。事实上，Git 不会给 Alice 或 Bob 任何提示，因为这些语义冲突是我们目前的工具无法检测的。

我们只有在尝试编译合并后的代码库时才会发现语义冲突，而且这只是其中的一个问题。如果代码是动态类型的语言，例如 javascript，那么我们可能直到用户开始报告线上的应用程序崩溃时才会被发现。

当变更的成本越来越高时，在系统中进行一些小优化投入产出比就会降低。这引入了一个微妙的阻力，随着时间的推移，对代码库的内部质量不利。更重要的是，能够逐渐改善代码库或阻止其逐渐退化的那种小而广泛的重构，正是会经常导致合并冲突的那种变更。在我看来，这是基于分支开发的真正隐性成本--**它抑制了那种 "童子军军规 "的改进，而这种改进可以防止代码库的某些区域逐渐退化为禁区。（童子军军规：永远把露营地弄得比你到达时还要干净，指随时处理和优化手中的问题）**

因此，在介绍了合并冲突会引起的问题后，下面让我们看看如何避免合并冲突。

# 二、在主干上同步修改代码

一个刚开始开发新应用的小团队，最初可能会试图通过让所有开发人员频繁地推送变更到共享的主干分支来降低发生大的意外合并冲突的风险，这是持续集成的核心原则之一。当每个人都在共享的主干分支中频繁地同步他们的修改时，意外的合并冲突可以在早期时暴露出来并解决掉。

不幸的是，让多个工作落在一个共享的主干分支上，会有一个很大的问题。如果任何一个工作没有准备好发布，那么共享分支上的任何东西都不能被发布。让我们用一个假想的例子来看看为什么。

Alice 和 Bob 是移动应用程序的两个开发人员，他们有两个正在进行的任务。Bob 正在对用户偏好的工作方式进行大修，而 Alice 正在完成一个关键的新功能，大老板规定必须在本周末前将其推送到应用商店。这个团队通过频繁地在主干提交代码来避免出现大的合并冲突。

到了周四，Alice正在结束她的工作同时也开始做功能测试。在对应用程序进行一般的测试时，她注意到用户偏好模块存在闪退现象，便问 Bob 是否知道是什么原因导致的。Bob 解释说，他正对这个模块进行重构，重构时间可能会比预期时间长一些，在完成前可能会存在 bug。但 Alice 的新功能本周又必须上线。经过了两天漫长的时间，Bob 和 Alice 终于一起回滚了 Bob 的更改，因为其中一些更改已经与 Alice 的新功能的修改纠缠在一起了。最终他们赶上了周六在产品商店上架，避免了一场危机。

上面的例子可以看到，由于 Alice 和 Bob 在一个共享分支上提交代码，他们原本相互独立的开发任务互相耦合在了一起。Alice 无法忽视 Bob 的工作而独立发布自己的变更，Bob 也是如此。这是在共享分支上工作的一个大问题，好在后面我们会介绍一些方法可以缓解这种情况。

# 三、特性分支

为了避免这种工作耦合的问题，开发团队往往会放弃将正在编写的代码推送到共享分支上的方式。有些团队会选择在本地机器 master 分支上工作，在工作完成后再推送到团队的共享仓库。其他团队会选择使用特性分支，在独立的分支上进行独立的工作，只有在开发完成后才合入到主干。

顺便提一下，当使用像 Git 这样的分布式源码控制系统时，这两种方法本质上是等同的；唯一的区别是，未合并的开发中的代码是在远程特性分支中可见，还是隐藏在开发者的本地主干上。因此，我把这两种方式都称为特性分支。


![2.jpg](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_u5tfStJtVVEh3UkAcQuY)

那么，如果一个团队使用了特性分支，那么他们所有的问题都解决了，对吗？可惜不是，我们重新引入了合并风险。特性分支上进行的工作，在被合并到共享的主干分支之前，并没有与其他的修改集成。每当两个工作同时修改到相同的文件时，无论是无意还是有意，都会存在一个潜在的合并冲突，这个潜在冲突会继续扩大，直到其中一个工作的分支合入主干。有些团队会通过频繁地将主干分支的修改合并到特性分支中来缓解这一问题。


![3.jpg](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_VA5M2WEAZ1ESHEdVDMv7)

然而，当存在并行的开发分支时，这种策略是没有效果的。例如只有当 Bob 的分支合并到主干上之后，Alice 的分支才能合入他的修改。这两个并行分支的潜在冲突只能等到 Alice 下一次合入主干代码的时候去解决了。

![图片4.jpg](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_8UcSYUgAib68Imb87sdC)

有些团队还会尝试 **“交叉合并”** 来解决代码合并冲突的问题，将一个特性分支的代码合并到另一个特性分支代码上，来减少分支之间潜在的合并冲突。然而一旦你将两个特性分支合并后，事实上你还是创建了一个含有进行中工作的共享分支，这和两个团队将进行中的工作合入共享 master 分支是一样的： **两个工作的代码变更内容仍然纠缠在了一起，所有的功能都是耦合在一起的，无法独立发布。**

![5.jpg](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_C2TgdyjZakYmSIGPFL3m)

总的来说，特性分支允许团队对工作进行解耦，让部分功能可以独立发布。然而，当特性分支做了大量的修改时，它们会带来大量合并冲突的风险。只有在其他并行工作已经完成并合入的情况下，从主干分支拉取代码合入自己的特性分支才会有帮助，而分支之间的交叉合并与在共享主干分支一样，都会将多个特性耦合在一起。

# 四、特性开关

如果一个团队想避免特性分支带来的合并冲突风险，他们有什么选择呢？他们可以回到在主干上频繁集成变更的方式，但我们说过这样做的一个主要问题是以前相互独立的开发工作现在被耦合在一起，不能独立发布。


这时，一种叫做特性开关（又称特性标识、比特或翻转器）的技术就可以帮上忙了** **特性开关通过将进行中的代码置于一个** **“标志”或“开关”** **之后来隔离他们的影响。工作中的代码只有在标志被打开时才会被执行。否则，它将作为** **“潜伏代码”** **存在于代码库中。下面是一个基本特性开关的使用方法：

```
if( featureFlags.isOn(“my-new-feature”) ){  
showNewFeatureInUI();  
}
```

**除非  my-new-feature 开关被配置为 "on"，否则新功能将不会在应用程序的用户界面中展现出来。** 这意味着，即使实现新功能的代码完全是错误的，只要该功能的标志是关闭的，应用程序也可以正常发布。通过使用特性开关，可以将正在进行中的代码推送到共享分支，而不妨碍该分支的发布。如果 Bob 的功能已经完成了一半，而 Alice 想发布她的功能，团队可以创建一个发布版本，把 Alice 完成的功能打开，而把 Bob 未完成的功能关闭。我们既得到了将开发工作持续集成的好处（减少了合并冲突的风险），又确保这些工作的发布是解耦的。

这种技术并不是什么新技术。它是 trunk based 的开发技术中的一部分（你可以知道这个技术不是新的，因为这个名字使用了 trunk 而不是 mastermoniker，后者在今天由于 git 的主导地位而更加普遍）。Flickr、Etsy、Github 和 Facebook 是这种技术的一些比较知名的支持者。正是特性开关的使用，使得 Facebook 可以做到 feacebook.com 网站基于主干每天发布两次。

# 五、特性开关的缺点

与到目前为止讨论的其他方法一样，特性开关也有其缺点。它们在代码库中引入了相当多的噪音，因为我们现在需要为任何开发中的特性显式的实现一个分支逻辑。这种噪音随着时间的推移会产生一些代码异味，除非时刻留意将不再需要的特性开关移除。测试人员可能需要一段时间来适应带特性开关的应用程序——将未完成的、未经测试的代码发布到应用商店的想法需要时间去接受。如果开关可以在运行时远程控制，那么团队需要明白，新的开关配置状态必须经过测试才能在用户的应用程序上生效。 


最后，某些类型的改动难以通过特性开关来保护——例如涉及大量文件变化的小改动就是一个挑战。令人欣慰的是，使用特性开关并不是一个非黑即白的方案；特性分支仍然可以用来处理那些不适于使用特性开关的繁琐变更。

# 六、合理使用特性开关

当一个团队开始采用特性开关时，通常会遇到上面提到的一些挑战，并最终找出解决问题的方法。下面是一些在代码库中成功使用特性开关的技巧。


#### 1、开关要有过期时间

很多团队在刚开始使用这种方法时，都会有些急功近利。他们倾向于引入大量的开关，却不想花时间去清除那些不再需要控制的开关。请确保花时间清理过期的开关--它们拖累你的代码设计并带来困惑。一些团队采取了相当积极的方法来确保旧开关得到清理，比如在创建开关时设置 "定时炸弹"，或者在一定时间后仍在使用时抛出一个异常。其他技术包括在创建开关时就在团队任务列表中添加一个对应的清除任务。

#### 2、开关不是『银弹』

在一个新的任务中并不总是可以使用特性开关。特性开关更适合于新功能或者替代功能的开发，在这些功能的入口可以在代码中单独的位置进行控制，通常通过可隐藏的按钮或者通过UI界面操作触发。而另一些工作，例如重构，则很难通过一个开关来包裹。对于这种情况，需要考虑使用特性分支，理想情况下最好拆解为可以增量开发的一系列子任务分支而不要使用一个长期的分支，以减少大量合并代码带来的冲突问题。

# 七、总结

特性开关和特性分支都是解耦并行代码变更的方法，允许团队在发布变更时减少协调开销。特性分支很容易上手，但会导致痛苦的合并冲突。这种对冲突的恐惧往往会抑制对代码库进行增量改进的行为，并可能导致代码库的某些区域最终成为 "禁区"。**特性开关允许团队实践真正的持续集成，并将代码变更与特性发布完全脱钩，但也必须付出实现每个开关的成本作为代价。**

特性开关不是银弹也不总是正确的选择，但对于研发团队上手很简单，你可以从一个简单的if/else语句开始，去探索特性开关带来的价值。

**关于作者**

Pete Hodgson 是 Rollout.io 的咨询顾问，同时也是一名软件工程师和架构师。主要是专注于通过测试自动化、特性开关、基于主干的开发和 DevOps 等实践以可持续的速度持续交付软件，他的客户包括旧金山初创公司到财富50强的企业，同时也经常担任播客小组成员，是美国和欧洲的定期会议发言人，也是一名特约作者。
