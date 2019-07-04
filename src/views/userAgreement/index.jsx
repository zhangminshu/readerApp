import React from 'react';
import './style.less'
class UserAgreement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="userAgreementWarp">
                <div className="mainContent">
                    <div className="bigTitle">用户协议</div>
                    <div className="line"></div>
                    <div className="subTitle">特别提示：</div>
                    <div className="content">
                        您在使用阅读链网站(www.yuedu.pro)提供的各项服务之前，请您务必审慎阅读、充分理解本协议各条款内容，
                        特别是以粗体标注的部分，包括但不限于免除或者限制责任的条款。如您不同意本服务协议及/或随时对其的修
                        改，您可以主动停止使用阅读链网站(www.yuedu.pro)提供的服务；您一旦使用阅读链网站(www.yuedu.pro)
                        提供的服务，即视为您已了解并完全同意本服务协议各项内容，包括阅读链网站(www.yuedu.pro)对服务协议
                        随时所做的任何修改，并成为我们的用户。
                    </div>
                    <div className="subTitle">一、总则</div>
                    <div className="item">
                        1、用户应当同意本协议的条款并按照页面上的提示完成全部的注册程序。用户在进行注册程序过程中点击"同意"按钮
                        即表示用户与阅读链网站(www.yuedu.pro)达成协议，完全接受本协议项下的全部条款。
                    </div>
                    <div className="item">
                        2、用户注册成功后，阅读链网站(www.yuedu.pro)将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户
                        负责保管；用户应当对以其用户帐号进行的所有活动和事件负法律责任。
                    </div>
                    <div className="item">
                        3、用户一经注册阅读链网站(www.yuedu.pro)帐号，除非子频道要求单独开通权限，用户有权利用该帐号使用阅读链网站
                        (www.yuedu.pro)各个频道的单项服务，当用户使用阅读链网站(www.yuedu.pro)各单项服务时，用户的使用行为视为其
                        对该单项服务的服务条款以及阅读链网站(www.yuedu.pro)在该单项服务中发出的各类公告的同意。
                    </div>
                    <div className="item">
                        4、阅读链网站(www.yuedu.pro)会员服务协议以及各个频道单项服务条款和公告可由阅读链网站(www.yuedu.pro)定时更
                        新，并予以公示。您在使用相关服务时,应关注并遵守其所适用的相关条款。
                    </div>
                    <div className="subTitle">二、注册信息和隐私保护</div>
                    <div className="item">
                        1、阅读链网站(www.yuedu.pro)帐号（即阅读链网站(www.yuedu.pro)用户ID）的所有权归阅读链网站(www.yuedu.pro)，用
                        户按注册页面引导填写信息，阅读并同意本协议且完成全部注册程序后，即可获得阅读链网站(www.yuedu.pro)帐号并成为用户。
                        用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册
                        资料。如果因注册信息不真实或更新不及时而引发的相关问题，阅读链网站(www.yuedu.pro)不负任何责任。您可以通过阅读链网站
                        (www.yuedu.pro)帐号设置页面查询、更正您的信息，用户应当通过真实身份信息认证注册帐号，且用户提交的帐号名称、头像和简介
                        等注册信息中不得出现违法和不良信息，经阅读链网站(www.yuedu.pro)审核，如存在上述情况，阅读链网站(www.yuedu.pro)将不
                        予注册；同时，在注册后，如发现用户以虚假信息骗取帐号名称注册，或其帐号头像、简介等注册信息存在违法和不良信息的，阅读
                        链网站(www.yuedu.pro)有权不经通知单方采取限期改正、暂停使用、注销登记、收回等措施。
                    </div>
                    <div className="item">
                        2、阅读链网站(www.yuedu.pro)帐号包括帐户名称和密码，您可使用设置的帐户名称（包括用户名、手机号、邮箱）和密码登录；在帐
                        号使用过程中，为了保障您的帐号安全基于不同的终端以及您的使用习惯，我们可能采取不同的验证措施识别您的身份。例如您的帐户在
                        新设备首次登录，我们可能通过密码加校验码的方式识别您的身份，验证方式包括但不限于短信验证码、服务使用信息验证。
                    </div>
                    <div className="item">
                        3、用户不应将其帐号、密码转让、出售或出借予他人使用，若用户授权他人使用帐户，应对被授权人在该帐户下发生所有行为负全部责
                        任。由于帐号关联用户使用信息，仅当依法律法规、司法裁定或经阅读链网站(www.yuedu.pro)同意，并符合阅读链网站(www.yuedu.pro)
                        规定的用户帐号转让流程的情况下，方可进行帐号的转让。
                    </div>
                    <div className="item">
                        4、因您个人原因导致的帐号信息遗失，如需找回阅读链网站(www.yuedu.pro)帐号信息，请按照阅读链网站(www.yuedu.pro)帐号找回要求
                        提供相应的信息，并确保提供的信息合法真实有效，若提供的信息不符合要求，无法通过阅读链网站(www.yuedu.pro)安全验证，阅读链网站
                        (www.yuedu.pro)有权拒绝提供帐号找回服务；若帐号的唯一凭证不再有效，阅读链网站(www.yuedu.pro)有权拒绝支持帐号找回。例如手机
                        号二次出售，阅读链网站(www.yuedu.pro)可拒绝支持帮助找回原手机号绑定的帐号。
                    </div>
                    <div className="item">
                        5、在需要终止使用阅读链网站(www.yuedu.pro)帐号服务时，符合以下条件的，您可以申请注销您的阅读链网站(www.yuedu.pro)帐号。
                        <div className="subItem">5.1、您仅能申请注销您本人的帐号，并依照阅读链网站(www.yuedu.pro)的流程进行注销；</div>
                        <div className="subItem">5.2、您仍应对您在注销帐号前且使用阅读链网站(www.yuedu.pro)服务期间的行为承担相应责任，同时阅读链网站(www.yuedu.pro)仍可保存您注销前的相关信息；</div>
                        <div className="subItem">5.3、注销成功后，帐号信息、个人身份证信息、交易记录、会员权益等将无法恢复或提供；</div>
                    </div>
                    <div className="item">
                        6、为了防止资源占用，如您连续六个月未使用您的阅读链网站(www.yuedu.pro)帐号或未通过阅读链网站(www.yuedu.pro)认可的其他方式登
                        录过您的阅读链网站(www.yuedu.pro)帐户，阅读链网站(www.yuedu.pro)有权对该帐户进行注销，您将不能再通过该帐号登录名登录本网站或
                        使用相关服务。如该帐户有关联的理财产品、待处理交易或余额，阅读链网站(www.yuedu.pro)会在合理范围内协助您处理，请您按照阅读链网站
                        (www.yuedu.pro)提示的方式进行操作。
                    </div>
                    <div className="item">
                        7、阅读链网站(www.yuedu.pro)的隐私权保护声明说明了阅读链网站(www.yuedu.pro)如何收集和使用用户信息。您
                        保证在您使用阅读链网站(www.yuedu.pro)的所有产品和服务前，已经充分了解并同意阅读链网站(www.yuedu.pro)可以据此处理用户信息。
                    </div>
                    <div className="item">
                        8、当您使用阅读链网站(www.yuedu.pro)产品进行登录等操作的时候，服务器会自动接收、验
                        证、并记录一些必要的信息，如手机号码、IP地址、服务访问异常信息、以及部分设备信息等，以保障您在使用阅读链网站
                        (www.yuedu.pro)服务时账户登录过程的安全，进而保护您的上网安全。您使用阅读链网站(www.yuedu.pro)的服务，即表
                        示您同意阅读链网站(www.yuedu.pro)可以按照相关的隐私权政策处理您的个人信息。阅读链网站(www.yuedu.pro)可能会
                        与合作伙伴共同向您提供您所要求的服务或者共同向您展示您可能感兴趣的内容。在信息为该项产品/服务所必须的情况下，您
                        同意阅读链网站(www.yuedu.pro)可与其分享必要的信息。并且，阅读链网站(www.yuedu.pro)会要求其确保数据安全并且禁
                        止用于任何其他用途。除此之外，阅读链网站(www.yuedu.pro)不会向任何无关第三方提供或分享信息。
                    </div>
                    <div className="item">
                        9、在如下情况下，阅读链网站(www.yuedu.pro)可能会披露您的信息:
                    <div className="subItem">9.1、事先获得您的授权；</div>
                        <div className="subItem">9.2、您使用共享功能；</div>
                        <div className="subItem">9.3、根据法律、法规、法律程序的要求或政府主管部门的强制性要求；</div>
                        <div className="subItem">9.4、以学术研究或公共利益为目的；</div>
                        <div className="subItem">9.5、为维护阅读链网站(www.yuedu.pro)的合法权益，例如查找、预防、处理欺诈或安全方面的问题；</div>
                        <div className="subItem">9.6、符合相关服务条款或使用协议的规定。</div>
                    </div>
                    <div className="item">10、您知悉并授权，阅读链网站(www.yuedu.pro)仅在必需的情况下使用或与关联公司同步您的信息，以为用户提供征信相关服务。</div>
                    <div className="item">11、为更好地向用户提供服务，您同意阅读链网站(www.yuedu.pro)通过短信等形式向您发送相关商业性服务信息。</div>
                    <div className="item">12、为了满足相关法律法规的要求和保障您的帐号安全，尤其是您在进行帐号解绑、注销等敏感操作时，我们会将您提交的个人身份信息发送至银行、运营商等机构进行验证查询，以核实您身份的真实性。</div>
                    <div className="subTitle">三、使用规则</div>
                    <div className="item">
                        1、用户在使用阅读链网站(www.yuedu.pro)的服务时，必须遵守《网络安全法》、《互联网新闻信息服务管理规定》等中华人民共和国相关法
                        律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为:
                    </div>
                    <div className="item">1.1、上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：</div>
                    <div className="item">
                        <div className="subItem">1.1.1、反对宪法所确定的基本原则的；</div>
                        <div className="subItem">1.1.2、危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</div>
                        <div className="subItem">1.1.3、损害国家荣誉和利益的；</div>
                        <div className="subItem">1.1.4、煽动民族仇恨、民族歧视、破坏民族团结的；</div>
                        <div className="subItem">1.1.5、破坏国家宗教政策，宣扬邪教和封建迷信的；</div>
                        <div className="subItem">1.1.6、散布谣言，扰乱社会秩序，破坏社会稳定的；</div>
                        <div className="subItem">1.1.7、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</div>
                        <div className="subItem">1.1.8、侮辱或者诽谤他人，侵害他人合法权利的；</div>
                        <div className="subItem">1.1.9、含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</div>
                        <div className="subItem">1.1.10、含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</div>
                    </div>
                    <div className="item">1.2、不得为任何非法目的而使用网络服务系统；</div>
                    <div className="item">
                        1.3、不利用阅读链网站(www.yuedu.pro)的服务从事以下活动：
                        <div className="subItem">1.3.1、未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</div>
                        <div className="subItem">1.3.2、未经允许，对计算机信息网络功能进行删除、修改或者增加的；</div>
                        <div className="subItem">1.3.3、未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</div>
                        <div className="subItem">1.3.4、故意制作、传播计算机病毒等破坏性程序的；</div>
                        <div className="subItem">1.3.5、其他危害计算机信息网络安全的行为。</div>
                    </div>

                    <div className="item">
                        2、用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿阅读链网站
                        (www.yuedu.pro)与合作公司、关联公司，并使之免受损害。对此，阅读链网站(www.yuedu.pro)有权视用户的行为性质，采取包括但不限于删除
                        用户发布信息内容、暂停使用许可、终止服务、限制使用、回收阅读链网站(www.yuedu.pro)帐号、追究法律责任等措施。对恶意注册阅读链网站
                        (www.yuedu.pro)帐号或利用阅读链网站(www.yuedu.pro)帐号进行违法活动、捣乱、骚扰、欺骗、其他用户以及其他违反本协议的行为，阅读链
                        网站(www.yuedu.pro)有权回收其帐号。同时，阅读链网站(www.yuedu.pro)会视司法部门的要求，协助调查。
                    </div>
                    <div className="item">3、用户不得对本服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于任何其它商业目的。</div>
                    <div className="item">
                        4、用户须对自己在使用阅读链网站(www.yuedu.pro)服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔
                    偿，以及在阅读链网站(www.yuedu.pro)首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予阅读链网站(www.yuedu.pro)等额的赔偿。</div>
                    <div className="item"></div>
                    5、用户在使用阅读链网站(www.yuedu.pro)服务时遵守以下互联网底线：
                    <div className="subItem">5.1、法律法规底线</div>
                    <div className="subItem">5.2、社会主义制度底线</div>
                    <div className="subItem">5.3、国家利益底线</div>
                    <div className="subItem">5.4、公民合法权益底线</div>
                    <div className="subItem">5.5、社会公共秩序底线</div>
                    <div className="subItem">5.6、道德风尚底线</div>
                    <div className="subItem">5.7、信息真实性底线</div>

                    <div className="subTitle">四、服务内容</div>
                    <div className="item">1、阅读链网站(www.yuedu.pro)网络服务的具体内容由阅读链网站(www.yuedu.pro)根据实际情况提供。</div>
                    <div className="item">2、除非本服务协议另有其它明示规定，阅读链网站(www.yuedu.pro)所推出的新产品、新功能、新服务，均受到本服务协议之规范。</div>
                    <div className="item">
                        3、为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，
                    您必须自行配备及负责与国际联网连线所需之一切必要装备，包括计算机、数据机或其它存取装置。</div>
                    <div className="item">
                        4、鉴于网络服务的特殊性，用户同意阅读链网站(www.yuedu.pro)有权不经事先通知，随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。
                    阅读链网站(www.yuedu.pro)不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。</div>
                    <div className="item">
                        5、免责声明：因以下情况造成网络服务在合理时间内的中断，阅读链网站(www.yuedu.pro)无需为此承担任何责任；
                    <div className="subItem">5.1、阅读链网站(www.yuedu.pro)需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，阅读链网站(www.yuedu.pro)保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。</div>
                        <div className="subItem">5.2、因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；</div>
                        <div className="subItem">5.3、用户的电脑软硬件和通信线路、供电线路出现故障的；</div>
                        <div className="subItem">5.4、因病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、银行原因、第三方服务瑕疵或政府行为等原因。</div>
                        <div className="subItem">5.5、尽管有前款约定，阅读链网站(www.yuedu.pro)将采取合理行动积极促使服务恢复正常。</div>
                    </div>
                    <div className="item">
                        6、本服务或第三人可提供与其它国际互联网上之网站或资源之链接。由于阅读链网站(www.yuedu.pro)无法控制这些网站及资源，您了解并同意，此类网站或资源是否可供
                        利用，阅读链网站(www.yuedu.pro)不予负责，存在或源于此类网站或资源之任何内容、广告、产品或其它资料，阅读链网站(www.yuedu.pro)亦不予保证或负责。因使用
                    或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，阅读链网站(www.yuedu.pro)不承担任何责任。</div>

                    <div className="item">
                        7、用户明确同意其使用阅读链网站(www.yuedu.pro)网络服务所存在的风险将完全由其自己承担。用户理解并接受下载或通过阅读链网站(www.yuedu.pro)服务取得的任何信
                    息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。阅读链网站(www.yuedu.pro)对在服务网上得到的服务都不作担保。</div>
                    <div className="item">
                        8、用户须知：阅读链网站(www.yuedu.pro)提供的各种挖掘推送服务中，推送给用户曾经访问过的网站或资源之链接是基于机器算法自动推出，阅读链网站(www.yuedu.pro)
                    不对其内容的有效性、安全性、合法性等做任何担保。</div>
                    <div className="item">9、阅读链网站(www.yuedu.pro)有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，阅读链网站(www.yuedu.pro)对用户和任何第三人均无需承担任何责任。</div>
                    <div className="item">
                        10、终止服务： 您同意阅读链网站(www.yuedu.pro)得基于其自行之考虑，因任何理由，包含但不限于长时间（超过一年）未使用，或阅读链网站(www.yuedu.pro)认为您已
                        经违反本服务协议的文字及精神，终止您的密码、帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之
                        本服务，无需进行事先通知即可中断或终止，您承认并同意，阅读链网站(www.yuedu.pro)可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文
                    件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，阅读链网站(www.yuedu.pro)对您或任何第三人均不承担任何责任。</div>

                    <div className="subTitle">五、知识产权和其他合法权益（包括但不限于名誉权、商誉权）</div>
                    <div className="item">1、用户专属权利</div>
                    <div className="item">阅读链网站(www.yuedu.pro)尊重他人知识产权和合法权益，呼吁用户也要同样尊重知识产权和他人合法权益。若您认为您的知识产权或其他合法权益被侵犯，请按照以下说明向阅读链网站(www.yuedu.pro)提供资料∶</div>
                    <div className="item">请注意：如果权利通知的陈述失实，权利通知提交者将承担对由此造成的全部法律责任（包括但不限于赔偿各种费用及律师费）。如果上述个人或单位不确定网络上可获取的资料是否侵犯了其知识产权和其他合法权益，阅读链网站(www.yuedu.pro)建议该个人或单位首先咨询专业人士。</div>
                    <div className="item">为了阅读链网站(www.yuedu.pro)有效处理上述个人或单位的权利通知，请使用以下格式（包括各条款的序号）：</div>
                    <div className="item">
                        <div className="subItem">1.1、权利人对涉嫌侵权内容拥有知识产权或其他合法权益和/或依法可以行使知识产权或其他合法权益的权属证明；</div>
                        <div className="subItem">1.2、请充分、明确地描述被侵犯了知识产权或其他合法权益的情况并请提供涉嫌侵权的第三方网址（如果有）。</div>
                        <div className="subItem">1.3、 请指明涉嫌侵权网页的哪些内容侵犯了第2项中列明的权利。</div>
                        <div className="subItem">1.4、请提供权利人具体的联络信息，包括姓名、身份证或护照复印件（对自然人）、单位登记证明复印件（对单位）、通信地址、电话号码、传真和电子邮件。</div>
                        <div className="subItem">1.5、请提供涉嫌侵权内容在信息网络上的位置（如指明您举报的含有侵权内容的出处，即：指网页地址或网页内的位置）以便我们与您举报的含有侵权内容的网页的所有权人/管理人联系。</div>
                        <div className="subItem">1.6、请在权利通知中加入如下关于通知内容真实性的声明： “我保证，本通知中所述信息是充分、真实、准确的，如果本权利通知内容不完全属实，本人将承担由此产生的一切法律责任。”</div>
                        <div className="subItem">1.7、请您签署该文件，如果您是依法成立的机构或组织，请您加盖公章。</div>
                        <div className="subItem">1.8、请您把以上资料和联络方式发往以下邮箱地址：famez@qq.com：</div>
                        <div className="strong">【特别注意：上述邮箱仅接受关于阅读链帐号（即仅限于帐号头像、昵称、用户名、简介）的侵权投诉。如您有关于阅读链非帐号产品的投诉，请按照阅读链权利声明或具体产品公示的投诉路径进行投诉。】</div>
                    </div>
                    <div className="item">
                        2、对于用户通过阅读链网站(www.yuedu.pro)服务上传到阅读链网站(www.yuedu.pro)网站上可公开获取区域的任何内容，用户同意阅读链网站(www.yuedu.pro)在全世界范围内具有免费的、
                        永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入
                    当前已知的或以后开发的其他任何形式的作品、媒体或技术中。</div>
                    <div className="item">3、阅读链网站(www.yuedu.pro)拥有本网站内所有资料的版权。任何被授权的浏览、复制、打印和传播属于本网站内的资料必须符合以下条件：
                        <div className="subItem">3.1、所有的资料和图象均以获得信息为目的；</div>
                        <div className="subItem">3.2、所有的资料和图象均不得用于商业目的；</div>
                        <div className="subItem">3.3、所有的资料、图象及其任何部分都必须包括此版权声明；</div>
                        <div className="subItem">3.4、本网站（www.yuedu.pro）所有的产品、技术与所有程序均属于阅读链网站(www.yuedu.pro)知识产权，在此并未授权。</div>
                        <div className="subItem">3.5、未经阅读链网站(www.yuedu.pro)许可，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用。否则，阅读链网站(www.yuedu.pro)将依法追究法律责任。</div>
                    </div>

                    <div className="subTitle">六、青少年用户特别提示</div>
                    <div className="item">
                        青少年用户必须遵守全国青少年网络文明公约：
                    <div className="subItem">1、要善于网上学习，不浏览不良信息；</div>
                        <div className="subItem">2、要诚实友好交流，不侮辱欺诈他人；</div>
                        <div className="subItem">3、要增强自护意识，不随意约会网友；</div>
                        <div className="subItem">4、要维护网络安全，不破坏网络秩序；</div>
                        <div className="subItem">5、要有益身心健康，不沉溺虚拟时空。</div>
                    </div>

                    <div className="subTitle">七、其他</div>
                    <div className="item">
                        <div className="subItem">1、本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</div>
                        <div className="subItem">2、如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向阅读链网站(www.yuedu.pro)所在地人民法院提起诉讼。</div>
                        <div className="subItem">3、阅读链网站(www.yuedu.pro)未行使或执行本服务协议任何权利或规定，不构成对前述权利或权利之放弃。</div>
                        <div className="subItem">4、如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</div>
                    </div>

                    <div className="item">请您在发现任何违反本服务协议以及其他任何单项服务的服务条款、阅读链网站(www.yuedu.pro)各类公告之情形时，通知阅读链网站(www.yuedu.pro)。您可以通过如下联络方式同阅读链网站(www.yuedu.pro)联系：famez@qq.com</div>

                </div>
            </div>
        )
    }
}

export default UserAgreement;